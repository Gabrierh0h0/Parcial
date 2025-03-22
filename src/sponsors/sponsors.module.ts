import { Module } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';

@Module({
  controllers: [SponsorsController],
  providers: [SponsorsService],
})
export class SponsorsModule {}
