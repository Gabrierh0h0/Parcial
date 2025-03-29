import { Module } from '@nestjs/common';
import { DictatorsService } from './dictators.service';
import { DictatorsController } from './dictators.controller';
import { Dictator } from './entities/dictator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './JwtStrategy';
import { AutenticadorModule } from 'src/autenticador/autenticador.module'; 

@Module({
  controllers: [DictatorsController],
  providers: [
    DictatorsService,
    JwtStrategy, 
         
  ],
  imports: [
    
    TypeOrmModule.forFeature([Dictator, Slave]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    AutenticadorModule 
  ],
  exports: [
    DictatorsService,
    JwtStrategy,
    TypeOrmModule,
    
  ],
})
export class DictatorsModule {}
