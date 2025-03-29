import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
import { AuthGuard } from '@nestjs/passport';
import { AutenticadorGuard } from 'src/autenticador/autenticador.guard';

@Controller('battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  //Usa la estrategia JWT para verificar si esta solicitud está autenticada
  
  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Post()
  async create(@Body() createBattleDto: CreateBattleDto) {
    return this.battlesService.create(createBattleDto);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get()
  async findAll() {
    return this.battlesService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.battlesService.findOne(id);
  }

  
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  async update(@Param('id') id: string, @Body() updateBattleDto: UpdateBattleDto) {
    return this.battlesService.update(id, updateBattleDto);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.battlesService.remove(id);
  }
}
