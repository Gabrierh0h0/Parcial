import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DictatorsService } from './dictators.service';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';
import { Slave } from 'src/slaves/entities/slave.entity';
import { AuthGuard } from '@nestjs/passport';
import { AutenticadorGuard } from 'src/autenticador/autenticador.guard';

@Controller('dictators')
export class DictatorsController {
  constructor(private readonly dictatorsService: DictatorsService) {}

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Post()
  create(@Body() createDictatorDto: CreateDictatorDto) {
    return this.dictatorsService.create(createDictatorDto);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get()
  findAll() {
    return this.dictatorsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictatorsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get(':dictatorId/slaves')
  async getSlavesByDictator(@Param('dictatorId') dictatorId: string): Promise<Slave[]> {
  return this.dictatorsService.findSlavesByDictator(dictatorId);
  } 

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictatorDto: UpdateDictatorDto) {
    return this.dictatorsService.update(id, updateDictatorDto);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictatorsService.remove(id);
  }
  
  @Post('login')
  login(@Body() loginDTO) {
    return this.dictatorsService.login(loginDTO)
  }
}
