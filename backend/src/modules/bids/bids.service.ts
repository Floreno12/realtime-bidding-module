// import { Injectable, BadRequestException } from '@nestjs/common';
// import { PrismaService } from '../database/prisma.service';
// import { CreateBidDto } from './create-bid.dto';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// @Injectable()
// export class BidsService {
//   private readonly STARTING_PRICE = 50.0;
//   private readonly MIN_INCREMENT = 5.0;

//   constructor(private prisma: PrismaService) {}

//   async getHighestBid(): Promise<number> {
//     const highestBidObj = await this.prisma.bid.findFirst({
//       orderBy: { amount: 'desc' },
//     });
//     return highestBidObj ? Number(highestBidObj.amount) : this.STARTING_PRICE;
//   }

//   async getBidHistory() {
//     return this.prisma.bid.findMany({
//       orderBy: { createdAt: 'desc' },
//       take: 5,
//     });
//   }

//   async placeBid(createBidDto: CreateBidDto) {
//     try {
//       return this.prisma.$transaction(
//         async (tx) => {
//           const highestBidRow = await tx.bid.findFirst({
//             orderBy: { amount: 'desc' },
//           });

//           const currentHighest = highestBidRow ? Number(highestBidRow.amount) : this.STARTING_PRICE;
//           const targetMinimum =
//             currentHighest === this.STARTING_PRICE && !highestBidRow
//               ? this.STARTING_PRICE
//               : currentHighest + this.MIN_INCREMENT;

//           if (createBidDto.amount < targetMinimum) {
//             throw new BadRequestException(
//               `Bid must be at least $${targetMinimum.toFixed(2)} (Minimum $${this.MIN_INCREMENT} increment).`,
//             );
//           }

//           const newBid = await tx.bid.create({
//             data: {
//               bidderEmail: createBidDto.bidderEmail,
//               amount: createBidDto.amount,
//             },
//           });

//           const history = await tx.bid.findMany({
//             orderBy: { createdAt: 'desc' },
//             take: 5,
//           });

//           return { newBid, history };
//         },
//         {
//           isolationLevel: 'Serializable' as any,
//         },
//       );
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError && error.code === 'P2034') {
//         throw new BadRequestException(
//           'High traffic on this item. Please try placing your bed again.',
//         );
//       }
//       throw error;
//     }
//   }
// }

import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBidDto } from './create-bid.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BidsService {
  private readonly STARTING_PRICE = 50.0;
  private readonly MIN_INCREMENT = 5.0;
  // Maximum internal database transaction retries
  private readonly MAX_RETRIES = 3;

  constructor(private prisma: PrismaService) {}

  async getHighestBid(): Promise<number> {
    const highestBidObj = await this.prisma.bid.findFirst({
      orderBy: { amount: 'desc' },
    });
    return highestBidObj ? Number(highestBidObj.amount) : this.STARTING_PRICE;
  }

  async getBidHistory() {
    return this.prisma.bid.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async placeBid(createBidDto: CreateBidDto) {
    let attempts = 0;

    while (attempts < this.MAX_RETRIES) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            // Read current state inside the isolated sandbox
            const highestBidRow = await tx.bid.findFirst({
              orderBy: { amount: 'desc' },
            });

            const currentHighest = highestBidRow
              ? Number(highestBidRow.amount)
              : this.STARTING_PRICE;
            const targetMinimum =
              currentHighest === this.STARTING_PRICE && !highestBidRow
                ? this.STARTING_PRICE
                : currentHighest + this.MIN_INCREMENT;

            // Business rule validation
            if (createBidDto.amount < targetMinimum) {
              throw new BadRequestException(
                `Bid must be at least $${targetMinimum.toFixed(2)} (Minimum $${this.MIN_INCREMENT} increment).`,
              );
            }

            // Write the new node record
            const newBid = await tx.bid.create({
              data: {
                bidderEmail: createBidDto.bidderEmail,
                amount: createBidDto.amount,
              },
            });

            const history = await tx.bid.findMany({
              orderBy: { createdAt: 'desc' },
              take: 5,
            });

            return { newBid, history };
          },
          {
            isolationLevel: 'Serializable',
          },
        );
      } catch (error) {
        attempts++;

        // If it's a standard business logic validation failure, pass it through instantly without retrying
        if (error instanceof BadRequestException) {
          throw error;
        }

        // Identify if it's a concurrency conflict/deadlock/serialization error
        const isConflictError =
          (error instanceof PrismaClientKnownRequestError &&
            ['P2034', 'P2024'].includes(error.code)) ||
          String(error).toLowerCase().includes('conflict') ||
          String(error).toLowerCase().includes('deadlock') ||
          String(error).toLowerCase().includes('serialization');

        if (isConflictError && attempts < this.MAX_RETRIES) {
          // Add a minor dynamic millisecond delay (jitter) before spinning back up to prevent thread collisions
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 50 + 10));
          continue;
        }

        // If we exhausted all retry allocation bounds, format it cleanly into a user-facing string
        throw new BadRequestException(
          'High bidding traffic detected on this item. Your bid was not processed in time. Please try again.',
        );
      }
    }

    throw new InternalServerErrorException('Transaction retry limit reached.');
  }
}
