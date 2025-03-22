import { IsNumber, IsString, Min, Max } from "class-validator";

export class CreateSponsorDto {

    @IsString()
    readonly company_name: string; 
        
    @IsString()
    readonly donated_items: string;
        
}
