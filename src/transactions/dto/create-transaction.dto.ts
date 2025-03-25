import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  buyer: string; // ID del Dictator que compra

  @IsString()
  @IsNotEmpty()
  seller: string; // ID del Dictator que vende

  @IsString()
  @IsNotEmpty()
  item: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}