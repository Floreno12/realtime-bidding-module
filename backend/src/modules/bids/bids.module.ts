import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsGateway } from './bids.gateway';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [BidsService, BidsGateway, PrismaService],
})
export class BidsModule {}
