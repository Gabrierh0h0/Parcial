import { Module } from '@nestjs/common';
import { DictatorsService } from './dictators.service';
import { DictatorsController } from './dictators.controller';
import { Dictator } from './entities/dictator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DictatorsController],
  providers: [DictatorsService],
    imports: [TypeOrmModule.forFeature([Dictator])],
  
})
export class DictatorsModule {}
