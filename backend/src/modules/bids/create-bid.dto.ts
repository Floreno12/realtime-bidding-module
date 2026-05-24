import { IsEmail, IsNumber, IsPositive } from 'class-validator';

export class CreateBidDto {
  @IsEmail({}, { message: 'A valid email is required to place a bid' })
  bidderEmail!: string;

  @IsNumber({}, { message: 'Bid amount must be a number' })
  @IsPositive({ message: 'Bid amount must be greater than 0' })
  amount!: number;
}
