import { IsString, MinLength } from "class-validator";

export class LoginDTO {

    @IsString()
    name: string;

    @IsString()
    @MinLength(8)
    password:string;

}