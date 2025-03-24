import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

      const newBattle = this.battleRepository.create({
        cons1,
        cons2,
        winner,
        death: createBattleDto.death || false,
        injuries: createBattleDto.injuries,
      });
      await this.battleRepository.save(newBattle);
      return newBattle;
    } else {
    // Si no hay ganador definido, creamos la batalla sin asignar un ganador
    const newBattle = this.battleRepository.create({
      cons1,
      cons2,
      death: createBattleDto.death || false,
      injuries: createBattleDto.injuries,
    });
      await this.battleRepository.save(newBattle);
      return newBattle;
    }
  }

  async findAll(): Promise<Battle[]> {
    const battles = await this.battleRepository.find({
      relations: ['cons1', 'cons2', 'winner', 'deadSlave'],
    });
    return battles;
  }

  async findOne(id: string): Promise<Battle> {
    const battle = await this.battleRepository.findOne({
      where: { id },
      relations: ['cons1', 'cons2', 'winner', 'deadSlave'],
    });

    if (!battle) {
      throw new NotFoundException(`Battle with ID ${id} not found`);
    }

    return battle;
  }

  //------------------------------------------------------------------------------------------------------------
  //Todos estos metodo los usa unica y exclusivamente el update 

  private async getWinner(winnerId: string, cons1: Slave, cons2: Slave): Promise<Slave> {
    const winner = await this.slaveRepository.findOne({ where: { id: winnerId } });
    if (!winner) {
      throw new NotFoundException(`Slave with ID ${winnerId} not found`);
    }
    if (winner.id !== cons1.id && winner.id !== cons2.id) {
      throw new BadRequestException(`Winner must be one of the contenders`);
    }
    winner.wins += 1;
    await this.slaveRepository.save(winner);
    return winner;
  }

  private processBattleResult(cons1: Slave, cons2: Slave, winner: Slave | null, death: boolean | undefined): { deadSlave: Slave | null } {
    if (death) {
      if (!winner) {
        throw new BadRequestException(`A winner must be specified if death is true`);
      }
      const loser = this.determineLoser(winner, cons1, cons2);
      loser.status = SlaveStatus.Dead;
      loser.losses += 1;
      this.slaveRepository.save(loser);
      return { deadSlave: loser };
    }

    if (winner) {
      const loser = this.determineLoser(winner, cons1, cons2);
      loser.losses += 1;
      this.slaveRepository.save(loser);
    }

    return { deadSlave: null };
  }

  private determineLoser(winner: Slave, cons1: Slave, cons2: Slave): Slave {
    if (winner.id === cons1.id) {
      return cons2;
    }
    return cons1;
  }

  //--------------------------------------------------------------------------------------------------------------

  async update(id: string, updateBattleDto: UpdateBattleDto): Promise<Battle> {
    // Buscar la batalla con sus relaciones
    const battle = await this.battleRepository.findOne({
      where: { id },
      relations: ['cons1', 'cons2', 'winner', 'deadSlave'],
    });
  
    if (!battle) {
      throw new NotFoundException(`Battle with ID ${id} not found`);
    }
  
    // Manejar el nuevo ganador si se proporciona
    if (updateBattleDto.winnerId !== undefined) {
      // Revertir estadísticas del ganador anterior si existe
      if (battle.winner) {
        battle.winner.wins -= 1;
        await this.slaveRepository.save(battle.winner);
      }
  
      // Asignar el nuevo ganador (o null)
      battle.winner = updateBattleDto.winnerId // esto continua abajito
        ? await this.getWinner(updateBattleDto.winnerId, battle.cons1, battle.cons2)
        : undefined;
    }
  
    // Manejar cambios en death o winner
    if (updateBattleDto.winnerId !== undefined || updateBattleDto.death !== undefined) {
      // Revertir el deadSlave anterior si existe
      if (battle.deadSlave) {
        battle.deadSlave.status = SlaveStatus.Alive;
        battle.deadSlave.losses -= 1;
        await this.slaveRepository.save(battle.deadSlave);
      }
  
      // Aplicar el nuevo resultado
      const battleResult = this.processBattleResult(
        battle.cons1,
        battle.cons2,
        battle.winner ?? null,
        updateBattleDto.death ?? battle.death, // Usar el nuevo valor o el existente
      );
      battle.deadSlave = battleResult.deadSlave ?? undefined;
      battle.death = updateBattleDto.death ?? battle.death;
    }
  
    // Actualizar injuries si se proporciona
    if (updateBattleDto.injuries !== undefined) {
      battle.injuries = updateBattleDto.injuries;
    }
  
    // Guardar y devolver
    return this.battleRepository.save(battle);
  }

  async remove(id: string): Promise<void> {
    const battle = await this.battleRepository.findOne({
      where: { id },
      relations: ['winner', 'deadSlave'],
    });
    if (!battle) {
      throw new NotFoundException(`Battle with ID ${id} not found`);
    }
    if (battle.winner) {
      battle.winner.wins -= 1;
      await this.slaveRepository.save(battle.winner);
    }
    if (battle.deadSlave) {
      battle.deadSlave.status = SlaveStatus.Alive;
      battle.deadSlave.losses -= 1;
      await this.slaveRepository.save(battle.deadSlave);
    }

    const result = await this.battleRepository.delete(id);
  }
}
