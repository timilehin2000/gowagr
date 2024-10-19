import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class InitiateTransferDto {
  @IsNotEmpty() @IsString() recipientUsername: string;
  @IsNotEmpty()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
}

export class IncrementBalanceDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
}
