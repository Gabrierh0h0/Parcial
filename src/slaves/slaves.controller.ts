import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SlavesService } from './slaves.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { UpdateSlaveDto } from './dto/update-slave.dto';
import { Dictator } from 'src/dictators/entities/dictator.entity';

@Controller('slaves')
export class SlavesController {
  constructor(private readonly slavesService: SlavesService) {}

  @Post(':dictatorId')create(@Body() createSlaveDto: CreateSlaveDto,@Param('dictatorId') dictatorId: string,) {
    return this.slavesService.create(createSlaveDto, dictatorId);
  }

  @Get()
  findAll() {
    return this.slavesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slavesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlaveDto: UpdateSlaveDto & { dictatorId?: string }) {
    const { dictatorId, ...rest } = updateSlaveDto;
    return this.slavesService.update(id, rest, dictatorId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slavesService.remove(id);
  }
}
