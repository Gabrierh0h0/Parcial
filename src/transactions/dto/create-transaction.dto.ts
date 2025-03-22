import { IsNumber, IsString, Min, Max } from "class-validator";

export class CreateTransactionDto {
    
    @IsString()
    readonly item: string;
    
    @IsNumber()
    readonly amount: number;

    @IsString()
    readonly status: string;

}
