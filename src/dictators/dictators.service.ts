import { Injectable } from '@nestjs/common';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictator } from './entities/dictator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DictatorsService {

  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository:Repository<Dictator>
  ) {}
  
  async create(createDictatorDto: CreateDictatorDto) {
    // Creamos la instancia del dish a partir del DTO
    const newDictator = this.dictatorRepository.create(createDictatorDto);
  
    // Guardamos la instancia en la base de datos
    await this.dictatorRepository.save(newDictator);
    return newDictator;
  }
  
  async findAll() {
    const dictator = await this.dictatorRepository.find({});
    return dictator;  
  }


  findOne(id: number) {
    return `This action returns a #${id} dictator`;
  }

  update(id: number, updateDictatorDto: UpdateDictatorDto) {
    return `This action updates a #${id} dictator`;
  }

  remove(id: number) {
    return `This action removes a #${id} dictator`;
  }
}
