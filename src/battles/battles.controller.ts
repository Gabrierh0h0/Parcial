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
  
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createBattleDto: CreateBattleDto) {
    return this.battlesService.create(createBattleDto);
  }

  
  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.battlesService.findAll();
  }
  
  
  @Get(':id')
  @UseGuards(AuthGuard(), AutenticadorGuard)
  async findOne(@Param('id') id: string) {
    return this.battlesService.findOne(id);
  }

  
  @Patch(':id')
  @UseGuards(AuthGuard(), AutenticadorGuard)
  async update(@Param('id') id: string, @Body() updateBattleDto: UpdateBattleDto) {
    return this.battlesService.update(id, updateBattleDto);
  }

  
  @Delete(':id')
  @UseGuards(AuthGuard(), AutenticadorGuard)
  async remove(@Param('id') id: string) {
    return this.battlesService.remove(id);
  }
}
