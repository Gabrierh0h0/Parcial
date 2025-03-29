import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Dictator } from './entities/dictator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/interface/JwtPayload'; // asegúrate que esta interfaz exista

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository: Repository<Dictator>
  ) {
    console.log('Construyendo: JwtStrategy')
    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new Error('SECRET_KEY is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('Payload recibido:', payload);
    const { name } = payload;
    const dictator = await this.dictatorRepository.findOneBy({ name });
    if (!dictator) {
      throw new UnauthorizedException('User not found');
    }
    return dictator;
  }
}
