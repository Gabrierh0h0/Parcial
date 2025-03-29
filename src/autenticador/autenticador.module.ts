import { Module } from '@nestjs/common';
import { AutenticadorGuard } from './autenticador.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictator } from 'src/dictators/entities/dictator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictator])],
  providers: [AutenticadorGuard],
  exports: [AutenticadorGuard],
})
export class AutenticadorModule {}
