import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/interface/JwtPayload";
import { Dictator } from "./entities/dictator.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(Dictator)
        private readonly dictatorRepository:Repository<Dictator>
    ){
        super({ 
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
        secretOrKey: process.env.SECRET_KEY 
        });
    }
    
    async validate(payload:JwtPayload){
        const {name} = payload;
        const dictator=await this.dictatorRepository.findOneBy({name:name});
        if(!dictator){
            throw new UnauthorizedException('User not found');
        }
        return dictator;
    }
}
