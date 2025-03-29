import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SlavesService } from './slaves.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { UpdateSlaveDto } from './dto/update-slave.dto';
import { Dictator } from 'src/dictators/entities/dictator.entity';
import { Battle } from 'src/battles/entities/battle.entity';
import { AuthGuard } from '@nestjs/passport';
import { AutenticadorGuard } from 'src/autenticador/autenticador.guard';

@Controller('slaves')
export class SlavesController {
  constructor(private readonly slavesService: SlavesService) {}

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Post(':dictatorId')create(@Body() createSlaveDto: CreateSlaveDto,@Param('dictatorId') dictatorId: string,) {
    return this.slavesService.create(createSlaveDto, dictatorId);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get()
  findAll() {
    return this.slavesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slavesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get(':id/battles')
  async getBattles(@Param('id') id: string): Promise<Battle[]> {
    return this.slavesService.getBattles(id);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlaveDto: UpdateSlaveDto & { dictatorId?: string }) {
    const { dictatorId, ...rest } = updateSlaveDto;
    return this.slavesService.update(id, rest, dictatorId);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slavesService.remove(id);
  }
}
