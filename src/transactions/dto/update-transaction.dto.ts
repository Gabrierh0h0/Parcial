import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  buyer?: string; // ID del Dictator que compra

  @IsString()
  @IsOptional()
  seller?: string; // ID del Dictator que vende

  @IsString()
  @IsOptional()
  item?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  status?: string;
}