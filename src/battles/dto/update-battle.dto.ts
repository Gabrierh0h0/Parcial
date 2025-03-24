import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateBattleDto {
  @IsString()
  @IsOptional()
  readonly winnerId?: string; // ID del ganador, opcional (puede ser null para eliminar el ganador)

  @IsBoolean()
  @IsOptional()
  readonly death?: boolean; // Indica si hubo una muerte, opcional

  @IsString()
  @IsOptional()
  readonly injuries?: string; // Descripción de las heridas, opcional
}