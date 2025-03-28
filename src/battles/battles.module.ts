import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from './entities/battle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';
import { DictatorsModule } from 'src/dictators/dictators.module';

@Module({
  controllers: [BattlesController],
  providers: [BattlesService],
  imports: [
    TypeOrmModule.forFeature([Battle, Slave]),
    DictatorsModule,
  ],
  exports: [TypeOrmModule],
})
export class BattlesModule {}
