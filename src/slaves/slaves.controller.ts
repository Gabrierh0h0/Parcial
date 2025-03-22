import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SlavesService } from './slaves.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { UpdateSlaveDto } from './dto/update-slave.dto';

@Controller('slaves')
export class SlavesController {
  constructor(private readonly slavesService: SlavesService) {}

  @Post()
  create(@Body() createSlaveDto: CreateSlaveDto) {
    return this.slavesService.create(createSlaveDto);
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
  update(@Param('id') id: string, @Body() updateSlaveDto: UpdateSlaveDto) {
    return this.slavesService.update(id, updateSlaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slavesService.remove(id);
  }
}
