import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BidsService } from './bids.service';
import { CreateBidDto } from './create-bid.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['https://realtime-bidding-frontend.vercel.app', 'https://new-t7bj.vercel.app'],
    credentials: true,
  },
})
export class BidsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly bidsService: BidsService) {}

  async handleConnection(client: Socket) {
    const currentHighest = await this.bidsService.getHighestBid();
    const history = await this.bidsService.getBidHistory();

    client.emit('auctionStatus', {
      currentHighest,
      history,
    });
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage('placeBid')
  async handlePlaceBid(
    @MessageBody() createBidDto: CreateBidDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.bidsService.placeBid(createBidDto);

      this.server.emit('auctionUpdated', {
        currentHighest: Number(result.newBid.amount),
        history: result.history,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while placing your bid';
      client.emit('bidError', {
        message: errorMessage,
      });
    }
  }
}
