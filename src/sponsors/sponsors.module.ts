import { Module } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';
import { Sponsor } from './entities/sponsor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SponsorsController],
  providers: [SponsorsService],
  imports: [TypeOrmModule.forFeature([Sponsor])],
  
})
export class SponsorsModule {}
