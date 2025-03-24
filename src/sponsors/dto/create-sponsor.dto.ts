import { IsNumber, IsString, Min, Max, IsUUID, IsOptional } from "class-validator";

export class CreateSponsorDto {

    @IsString()
    readonly company_name: string; 
        
    @IsString()
    readonly donated_items: string;

    @IsUUID()
    readonly slaveId: string;
}
