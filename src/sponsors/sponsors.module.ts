import { Module } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';
import { Sponsor } from './entities/sponsor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';
import { DictatorsModule } from 'src/dictators/dictators.module';

@Module({
  controllers: [SponsorsController],
  providers: [SponsorsService],
  imports: [TypeOrmModule.forFeature([Sponsor, Slave]), DictatorsModule],
  
})
export class SponsorsModule {}
