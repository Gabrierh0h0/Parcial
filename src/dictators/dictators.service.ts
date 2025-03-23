import { Injectable } from '@nestjs/common';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictator } from './entities/dictator.entity';
import { Repository } from 'typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';

@Injectable()
export class DictatorsService {

  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository:Repository<Dictator>,
    @InjectRepository(Slave)
    private readonly slaveRepository: Repository<Slave>,
  ) {}
  
  async create(createDictatorDto: CreateDictatorDto) {
    // Creamos la instancia del dish a partir del DTO
    const newDictator = this.dictatorRepository.create(createDictatorDto);
  
    // Guardamos la instancia en la base de datos
    await this.dictatorRepository.save(newDictator);
    return newDictator;
  }
  
  findAll() {
    return this.dictatorRepository.find({ relations: ['slaves'] });
  }

  async findOne(id: string) {

    const dictator = await this.dictatorRepository.findOne({
      where: { id },
      relations: ['slaves'],
    });
    if (dictator) {
      dictator.number_slaves = dictator.slaves.length; // Actualiza dinámicamente
      await this.dictatorRepository.save(dictator); // Guarda el cambio
    }
    return dictator;
  }
     
  async update(id: string, updateDictatorDto: UpdateDictatorDto) {
    await this.dictatorRepository.update(id, updateDictatorDto);
    return this.findOne(id); // Esto actualizará number_slaves también
  }

  async remove(id: string) {
    return this.dictatorRepository.delete(id);
  }

  // Método adicional para actualizar number_slaves después de agregar/quitar esclavos
  async updateNumberOfSlaves(id: string) {
    const dictator = await this.findOne(id);
    if (dictator) {
      dictator.number_slaves = dictator.slaves.length;
      return this.dictatorRepository.save(dictator);
    }
  }

  async findSlavesByDictator(dictatorId: string): Promise<Slave[]> {
    // Se consulta la base de datos filtrando por la relación 'dictator'
    const slaves = await this.slaveRepository.find({
      where: { dictator: { id: dictatorId } },
    });
  
    return slaves;
  }

}
