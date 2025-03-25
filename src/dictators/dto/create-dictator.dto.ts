import { IsNumber, IsString, Min, Max, IsOptional, MinLength } from "class-validator";

export class CreateDictatorDto {

    @IsString()
    readonly name: string;

    @IsString()
    readonly territory: string;
    
    @IsNumber()
    @Min(0)
    @IsOptional()
    readonly number_slaves?: number;

    @IsNumber()
    @Min(1)
    @Max(100)
    readonly loyalty: number;

    @IsString()
    @MinLength(8)
    readonly password: string;

}
