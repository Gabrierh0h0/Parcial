import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';

@Controller('battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Post()
  create(@Body() createBattleDto: CreateBattleDto) {
    return this.battlesService.create(createBattleDto);
  }

  @Get()
  findAll() {
    return this.battlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.battlesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBattleDto: UpdateBattleDto) {
    return this.battlesService.update(id, updateBattleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.battlesService.remove(id);
  }
}
