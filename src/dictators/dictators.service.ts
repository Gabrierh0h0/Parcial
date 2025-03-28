import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictator } from './entities/dictator.entity';
import { Repository } from 'typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';
import * as bcrypt from 'bcrypt'; //Para encriptar
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interface/JwtPayload';

@Injectable()
export class DictatorsService {

  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository:Repository<Dictator>,
    @InjectRepository(Slave)
    private readonly slaveRepository: Repository<Slave>,

    private readonly jwtService: JwtService

  ) {}
  
  async create(createDictatorDto: CreateDictatorDto) {
    // Creamos la instancia del dish a partir del DTO
    const newDictator = this.dictatorRepository.create({...createDictatorDto, password:bcrypt.hashSync(createDictatorDto.password, 10) });

    // Guardamos la instancia en la base de datos
    await this.dictatorRepository.save(newDictator);
    return newDictator;
  }

  private getJwtToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload);
    return token;
  }

  async login(loginDTO: LoginDTO) {
    const {name, password} = loginDTO;
    const dictator = await this.dictatorRepository.findOneBy({ name: name});
    if (!dictator) {
      throw new NotFoundException('Usted no es un dictator, no puede ingresar a la plataforma');
    }
    const valid = bcrypt.compareSync(password, dictator.password);
    if(!valid) {
      throw new NotFoundException('Credenciales invalidas');
    }
    const jwtPayload: JwtPayload = {name};
    const token = this.getJwtToken(jwtPayload); 
    return {dictator, token};
  }
  
  findAll() {
    return this.dictatorRepository.find({ relations: ['slaves'] });
  }

  async findOne(id: string) {

    return this.dictatorRepository.findOne({
      where: { id },
      relations: ['slaves'],
    });

  }
     
  async update(id: string, updateDictatorDto: UpdateDictatorDto) {
    // Actualiza los datos en general del dictator y actualiza y encripta la password
    await this.dictatorRepository.update(id ,{...updateDictatorDto, password:bcrypt.hashSync(updateDictatorDto.password, 10) });
    await this.updateNumberOfSlaves(id); // Actualiza number_slaves
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.dictatorRepository.delete(id);
  }

  // Método adicional para actualizar number_slaves después de agregar/quitar esclavos
  async updateNumberOfSlaves(id: string) {

    const dictator = await this.dictatorRepository.findOne({
      where: { id },
      relations: ['slaves'],
    });
  
    if (!dictator) {
      console.log(`Dictator ${id} no encontrado`);
      return;
    }

    dictator.number_slaves = dictator.slaves.length;
    await this.dictatorRepository.save(dictator);

  }

  async findSlavesByDictator(dictatorId: string): Promise<Slave[]> {
    // Se consulta la base de datos filtrando por la relación 'dictator'
    const slaves = await this.slaveRepository.find({
      where: { dictator: { id: dictatorId } },
    });
  
    return slaves;
  }

}
