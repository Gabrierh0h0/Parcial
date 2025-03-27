import { Module } from '@nestjs/common';
import { DictatorsService } from './dictators.service';
import { DictatorsController } from './dictators.controller';
import { Dictator } from './entities/dictator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [DictatorsController],
  providers: [DictatorsService],
  imports: [TypeOrmModule.forFeature([Dictator, Slave]), 
  // jwt es la estrategia por defecto
  PassportModule.register({ defaultStrategy: 'jwt'}),
  JwtModule.registerAsync({
    imports: [],
    inject: [],
    useFactory: () => {
      return {
        secret: process.env.SECRET_KEY,
        signOptions: {
          expiresIn: '1h'
        }
      }
    }
  })],
  exports: [DictatorsService, TypeOrmModule],
})
export class DictatorsModule {}
