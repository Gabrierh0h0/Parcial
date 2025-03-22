import { IsString, IsBoolean } from "class-validator";

export class CreateBattleDto {

    @IsBoolean()
    readonly death: boolean;
    
    @IsString()
    readonly injuries: string;

    date: Date;

}
