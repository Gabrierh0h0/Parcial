import { Module } from '@nestjs/common';
import { SlavesService } from './slaves.service';
import { SlavesController } from './slaves.controller';
import { Slave } from './entities/slave.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictatorsModule } from 'src/dictators/dictators.module';
import { Battle } from 'src/battles/entities/battle.entity';

@Module({
  controllers: [SlavesController],
  providers: [SlavesService],
  imports: [TypeOrmModule.forFeature([Slave,Battle]),
  DictatorsModule],
  exports:[TypeOrmModule]

})
export class SlavesModule {}
