import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Battle } from './entities/battle.entity';
import { Repository } from 'typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';
import { SlaveStatus } from 'src/slaves/dto/create-slave.dto';

@Injectable()
export class BattlesService {

  constructor(
    @InjectRepository(Battle)
    private readonly battleRepository:Repository<Battle>,
    @InjectRepository(Slave)
    private readonly slaveRepository: Repository<Slave>,
  ) {}

  async create(createBattleDto: CreateBattleDto) {

    const cons1 = await this.slaveRepository.findOne({where: {id:createBattleDto.cons1Id}})
    if (!cons1) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons1Id} not found`);
    }
    if (cons1.status === SlaveStatus.Dead) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons1Id} is dead and cannot fight`);
    }
    const cons2 = await this.slaveRepository.findOne({where: {id:createBattleDto.cons2Id}})
    if (!cons2) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons2Id} not found`);
    }
    if (cons2.status === SlaveStatus.Dead) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons2Id} is dead and cannot fight`);
    }

    let loser: Slave | null
    let winner: Slave | null
    
    if(createBattleDto.winnerId){
      winner = await this.slaveRepository.findOne({where: {id:createBattleDto.winnerId}})

      if (!winner) {
        throw new NotFoundException(`Winner with ID ${createBattleDto.winnerId} not found`);
      }

      if(winner.id !== cons1.id && winner.id !== cons2.id ){
        throw new NotFoundException(`winner must be one of the contenders`);
      }

      if(winner === cons1){
        loser = cons2
      }
      else{
        loser = cons1
      }
      loser.losses +=1
      winner.wins += 1
      if(createBattleDto.death){
        loser.status = "dead"    
      }

      await this.slaveRepository.save(loser)
      await this.slaveRepository.save(winner)

      const newBattle = this.battleRepository.create(createBattleDto);
      await this.battleRepository.save(newBattle);
    }
  }

  findAll() {
    return this.battleRepository.find({ relations: ['slaves'] });
  }

  async findOne(id: string) {

    return this.battleRepository.findOne({
      where: { id },
      relations: ['slaves'],
      
    });

  }

  update(id: string, updateBattleDto: UpdateBattleDto) {
    return `This action updates a #${id} battle`;
  }

  remove(id: string) {
    return `This action removes a #${id} battle`;
  }
}
