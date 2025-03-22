import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from './entities/battle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BattlesController],
  providers: [BattlesService],
    imports: [TypeOrmModule.forFeature([Battle])],
  
})
export class BattlesModule {}
