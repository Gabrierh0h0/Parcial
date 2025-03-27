import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { AuthGuard } from '@nestjs/passport';
import { AutenticadorGuard } from 'src/autenticador/autenticador.guard';

@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Post()
  create(@Body() createSponsorDto: CreateSponsorDto) {
    return this.sponsorsService.create(createSponsorDto);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get()
  findAll() {
    return this.sponsorsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sponsorsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlaveDto: UpdateSponsorDto & { slaveId?: string }) {
    const { slaveId, ...rest } = updateSlaveDto;
    return this.sponsorsService.update(id, rest, slaveId);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sponsorsService.remove(id);
  }
}
