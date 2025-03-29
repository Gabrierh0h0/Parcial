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
    private readonly battleRepository: Repository<Battle>,
    @InjectRepository(Slave)
    private readonly slaveRepository: Repository<Slave>,
  ) {}

  async create(createBattleDto: CreateBattleDto) {
    // Buscar los esclavos contendientes (cons1 y cons2)
    const cons1 = await this.slaveRepository.findOne({ where: { id: createBattleDto.cons1Id } });
    if (!cons1) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons1Id} not found`);
    }
    if (cons1.status === SlaveStatus.Dead || cons1.status === SlaveStatus.Free) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons1Id} is dead or free and cannot fight`);
    }
    const cons2 = await this.slaveRepository.findOne({ where: { id: createBattleDto.cons2Id } });
    if (!cons2) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons2Id} not found`);
    }
    if (cons2.status === SlaveStatus.Dead || cons2.status === SlaveStatus.Free) {
      throw new NotFoundException(`Slave with ID ${createBattleDto.cons2Id} is dead or free and cannot fight`);
    }
  
    let winner: Slave | undefined;
  
    // Si se proporciona un ganador (winnerId), procesar la lógica de victoria/derrota
    if (createBattleDto.winnerId) {
      // Usamos getWinner para buscar y validar al ganador
      winner = await this.getWinner(createBattleDto.winnerId, cons1, cons2);
      // Procesamos el resultado de la batalla (actualiza estadísticas y si hay muerte se muere el perdedor)
      this.processBattleResult(cons1, cons2, winner, createBattleDto.death);

    } else {
      // Si no hay ganador, procesamos el resultado (puede haber muerte se mueren los 2)
      this.processBattleResult(cons1, cons2, undefined, createBattleDto.death);

    }

    // Crear la batalla
    const newBattle = this.battleRepository.create({
      cons1,
      cons2,
      winner,
      death: createBattleDto.death || false,
      injuries: createBattleDto.injuries,
    });
  
    // Guardar y retornar la batalla
    await this.battleRepository.save(newBattle);
    return newBattle;
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
    winner.wins = Number(winner.wins) + 1;
    await this.slaveRepository.save(winner);
    return winner;
  }

  private processBattleResult(cons1: Slave, cons2: Slave, winner: Slave | undefined, death: boolean | undefined): void {
    if (death) {
      if (!winner) {
        // Si death es true pero no hay ganador, ambos esclavos mueren
        cons1.status = SlaveStatus.Dead;
        cons2.status = SlaveStatus.Dead;
        cons1.losses = Number(cons1.losses) + 1;
        cons2.losses = Number(cons2.losses) + 1;
        cons1.wins = Number(cons1.wins) + 1; // Ambos "ganan" y "pierden"
        cons2.wins = Number(cons2.wins) + 1;
        this.slaveRepository.save([cons1, cons2]); // Guardamos ambos
        return;
      }

      // Si hay ganador, el perdedor muere
      const loser = this.determineLoser(winner, cons1, cons2);
      loser.status = SlaveStatus.Dead;
      loser.losses = Number(loser.losses) + 1;
      this.slaveRepository.save(loser);
      return; //aqui se sale y no entra al otro 
    }
  
    if (winner) {
      const loser = this.determineLoser(winner, cons1, cons2);
      loser.losses = Number(loser.losses) + 1;
      this.slaveRepository.save(loser);
    }
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
      relations: ['cons1', 'cons2', 'winner'],
    });
  
    if (!battle) {
      throw new NotFoundException(`Battle with ID ${id} not found`);
    }
  
    // Revertir estadísticas y estados anteriores
    if (battle.winner) {
      // Revertir victorias del ganador anterior
      battle.winner.wins = Number(battle.winner.wins) - 1;
      await this.slaveRepository.save(battle.winner);
  
      // Revertir derrotas y estado del perdedor anterior
      const previousLoser = this.determineLoser(battle.winner, battle.cons1, battle.cons2);
      previousLoser.losses = Number(previousLoser.losses) - 1;
      if (battle.death) {
        previousLoser.status = SlaveStatus.Alive; // Revertir muerte
      }
      await this.slaveRepository.save(previousLoser);
    } else if (battle.death) {
      // Si no había ganador pero death era true, ambos esclavos estaban muertos
      battle.cons1.status = SlaveStatus.Alive;
      battle.cons2.status = SlaveStatus.Alive;
      battle.cons1.losses = Number(battle.cons1.losses) - 1;
      battle.cons2.losses = Number(battle.cons2.losses) - 1;
      await this.slaveRepository.save([battle.cons1, battle.cons2]);
    }
  
    // Manejar el nuevo ganador si se proporciona
    if (updateBattleDto.winnerId !== undefined) {
      battle.winner = await this.getWinner(updateBattleDto.winnerId, battle.cons1, battle.cons2);
    }
  
    // Manejar cambios en death o winner
    if (updateBattleDto.winnerId !== undefined || updateBattleDto.death !== undefined) {
      const newDeath = updateBattleDto.death ?? battle.death; // Usar el nuevo valor o el existente
      this.processBattleResult(battle.cons1, battle.cons2, battle.winner, newDeath);
      battle.death = newDeath;
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
      relations: ['cons1', 'cons2', 'winner'],
    });
  
    if (!battle) {
      throw new NotFoundException(`Battle with ID ${id} not found`);
    }
  
    // Revertir estadísticas y estados
    if (battle.winner) {
      // Revertir victorias del ganador
      battle.winner.wins = Number(battle.winner.wins) - 1;
      await this.slaveRepository.save(battle.winner);
  
      // Revertir derrotas y estado del perdedor
      const loser = this.determineLoser(battle.winner, battle.cons1, battle.cons2);
      loser.losses = Number(loser.losses) - 1;
      if (battle.death) {
        loser.status = SlaveStatus.Alive; // Revertir muerte
      }
      await this.slaveRepository.save(loser);
    } else if (battle.death) {
      // Si no había ganador pero death era true, ambos esclavos estaban muertos
      battle.cons1.status = SlaveStatus.Alive;
      battle.cons2.status = SlaveStatus.Alive;
      battle.cons1.losses = Number(battle.cons1.losses) - 1;
      battle.cons2.losses = Number(battle.cons2.losses) - 1;
      await this.slaveRepository.save([battle.cons1, battle.cons2]);
    }
  
    // Eliminar la batalla
    await this.battleRepository.delete(id);
  }
}