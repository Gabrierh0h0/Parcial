import { Injectable } from '@nestjs/common';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { UpdateSlaveDto } from './dto/update-slave.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Slave } from './entities/slave.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SlavesService {

  constructor(
    @InjectRepository(Slave)
    private readonly slaveRepository:Repository<Slave>
  ) {}

  async create(createSlaveDto: CreateSlaveDto) {
    // Creamos la instancia del dish a partir del DTO
  const newSlave = this.slaveRepository.create(createSlaveDto);

  // Guardamos la instancia en la base de datos
  await this.slaveRepository.save(newSlave);
  return newSlave;
  }

  async findAll() {
    const slave = await this.slaveRepository.find({});
    return slave;  
  }

  async findOne(id: string) {
    return this.slaveRepository.findOneBy({id});
  }

  update(id: string, updateSlaveDto: UpdateSlaveDto) {
    return `This action updates a #${id} slave`;
  }

  async remove(id: string) {
    return this.slaveRepository.delete({id});
  }
}
