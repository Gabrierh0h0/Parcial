import { Module } from '@nestjs/common';
import { SlavesService } from './slaves.service';
import { SlavesController } from './slaves.controller';
import { Slave } from './entities/slave.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SlavesController],
  providers: [SlavesService],
  imports: [TypeOrmModule.forFeature([Slave])],

})
export class SlavesModule {}
