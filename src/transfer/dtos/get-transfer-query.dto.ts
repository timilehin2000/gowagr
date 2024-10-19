import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  IsEnum,
  //   IsPositive,
} from 'class-validator';
import { TransferTypeEnum } from '../enum/transfer.enum';

export class GetTransfersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  otherPartyUsername?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TransferTypeEnum)
  type?: TransferTypeEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minimumAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maximumAmount?: number;
}
