import { Module } from '@nestjs/common';
import { DictatorsService } from './dictators.service';
import { DictatorsController } from './dictators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  controllers: [DictatorsController],
  providers: [DictatorsService],
})
export class DictatorsModule {}
