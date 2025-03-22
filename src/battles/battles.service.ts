import { Injectable } from '@nestjs/common';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Battle } from './entities/battle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BattlesService {

  constructor(
    @InjectRepository(Battle)
    private readonly battleRepository:Repository<Battle>
  ) {}

  async create(createBattleDto: CreateBattleDto) {
  // Creamos la instancia del dish a partir del DTO
  const newBattle = this.battleRepository.create(createBattleDto);

  // Guardamos la instancia en la base de datos
  await this.battleRepository.save(newBattle);
  return newBattle;
  }

  async findAll() {
    const battle = await this.battleRepository.find({});
    return battle;  
  }

  findOne(id: number) {
    return `This action returns a #${id} battle`;
  }

  update(id: number, updateBattleDto: UpdateBattleDto) {
    return `This action updates a #${id} battle`;
  }

  remove(id: number) {
    return `This action removes a #${id} battle`;
  }
}
