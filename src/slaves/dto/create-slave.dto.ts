import { IsNumber, IsString, Min, Max } from "class-validator";

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
    readonly wins: number;

    @IsNumber()
    readonly losses: number;

    @IsString()
    readonly status: string;

}