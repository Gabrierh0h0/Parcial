import { IsNumber, IsString, Min, Max, IsEnum, IsOptional } from "class-validator";

export enum SlaveStatus {
  Dead = "dead",
  Alive = "alive",
  Escaped = "escaped",
  Free = "free",
}

export class CreateSlaveDto {

    @IsString()
    readonly name: string; 
    
    @IsString()
    readonly nickname: string;

    @IsString()
    readonly origin: string;
    
    @IsNumber()
    @Min(1)
    @Max(100)
    readonly strength: number;

    @IsNumber()
    @Min(1)
    @Max(100)
    readonly agility: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    readonly wins: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    readonly losses: number;

    @IsEnum(SlaveStatus)
    readonly status: SlaveStatus;

}