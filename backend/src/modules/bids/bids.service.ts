import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBidDto } from './create-bid.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BidsService {
  private readonly STARTING_PRICE = 50.0;
  private readonly MIN_INCREMENT = 5.0;

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
      take: 5,
    });
  }

  async placeBid(createBidDto: CreateBidDto) {
    try {
      return this.prisma.$transaction(
        async (tx) => {
          const highestBidRow = await tx.bid.findFirst({
            orderBy: { amount: 'desc' },
          });

          const currentHighest = highestBidRow ? Number(highestBidRow.amount) : this.STARTING_PRICE;
          const targetMinimum =
            currentHighest === this.STARTING_PRICE && !highestBidRow
              ? this.STARTING_PRICE
              : currentHighest + this.MIN_INCREMENT;

          if (createBidDto.amount < targetMinimum) {
            throw new BadRequestException(
              `Bid must be at least $${targetMinimum.toFixed(2)} (Minimum $${this.MIN_INCREMENT} increment).`,
            );
          }

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
          isolationLevel: 'Serializable' as any,
        },
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2034') {
        throw new BadRequestException(
          'High traffic on this item. Please try placing your bed again.',
        );
      }
      throw error;
    }
  }
}
