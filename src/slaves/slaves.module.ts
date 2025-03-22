import { Module } from '@nestjs/common';
import { SlavesService } from './slaves.service';
import { SlavesController } from './slaves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SlavesController],
  providers: [SlavesService],
  exports:[TypeOrmModule],

})
export class SlavesModule {}
