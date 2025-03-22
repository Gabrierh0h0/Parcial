import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';

@Module({
  controllers: [BattlesController],
  providers: [BattlesService],
})
export class BattlesModule {}
