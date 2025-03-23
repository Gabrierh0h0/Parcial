import { Module } from '@nestjs/common';
import { DictatorsService } from './dictators.service';
import { DictatorsController } from './dictators.controller';
import { Dictator } from './entities/dictator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';

@Module({
  controllers: [DictatorsController],
  providers: [DictatorsService],
  imports: [TypeOrmModule.forFeature([Dictator, Slave])],
  exports: [DictatorsService, TypeOrmModule],
})
export class DictatorsModule {}
