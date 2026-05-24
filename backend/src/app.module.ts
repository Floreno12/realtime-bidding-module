import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BidsModule } from './modules/bids/bids.module';

@Module({
  imports: [BidsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
