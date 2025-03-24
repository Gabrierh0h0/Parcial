import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateBattleDto {
  @IsString()
  @IsNotEmpty()
  readonly cons1Id: string;

  @IsString()
  @IsNotEmpty()
  readonly cons2Id: string;

  @IsString()
  @IsOptional()
  readonly winnerId: string;

  @IsBoolean()
  @IsOptional()
  readonly death?: boolean;

  @IsString()
  @IsNotEmpty()
  readonly injuries: string;
}