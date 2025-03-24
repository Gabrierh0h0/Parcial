import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { UpdateSlaveDto } from './dto/update-slave.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Slave } from './entities/slave.entity';
import { Repository } from 'typeorm';
import { Dictator } from 'src/dictators/entities/dictator.entity';
import { DictatorsService } from 'src/dictators/dictators.service';
import { Battle } from 'src/battles/entities/battle.entity';

@Injectable()
export class SlavesService {

  constructor(
    @InjectRepository(Slave)
    private readonly slaveRepository:Repository<Slave>,
    @InjectRepository(Dictator)
    private readonly dictatorRepository:Repository<Dictator>,
    private readonly dictatorsService: DictatorsService,
    @InjectRepository(Battle)
    private readonly battleRepository:Repository<Battle>, // Inyección del servicio
  ) {}

  async create(createSlaveDto: CreateSlaveDto, dictatorId: string) {
    //Busca el dictador
    const dictator = await this.dictatorRepository.findOne({
      where: { id: dictatorId },
    });
    if (!dictator) {
      throw new NotFoundException(`Dictator with ID ${dictatorId} not found`);
    }

    // Crea el esclavo con dictador
    const slave = this.slaveRepository.create({
      ...createSlaveDto, // Propaga las propiedades del DTO (como name)
      dictator, // Asigna el dictador encontrado a la relación
    });
    
    // Guarda el esclavo en la base de datos
    await this.slaveRepository.save(slave); 
    // Actualiza el contador de esclavos
    await this.dictatorsService.updateNumberOfSlaves(dictatorId);
    return this.findOne(slave.id);

  }

  async findAll(): Promise<Slave[]> {
    return this.slaveRepository.find({ relations: ['dictator'] }); // Carga la relación
  }

  async findOne(id: string): Promise<Slave> {
    const slave = await this.slaveRepository.findOne({
      where: { id },
      relations: ['dictator'], // Carga la relación
    });
    if (!slave) {
      throw new NotFoundException(`Slave with ID ${id} not found`);
    }
    return slave;
  }

  async update(id: string, updateSlaveDto: UpdateSlaveDto, dictatorId?: string): Promise<Slave> {
    const slave = await this.findOne(id); // Busca el esclavo existente
    const previousDictatorId = slave.dictator?.id; // Guarda el ID del dictador anterior

    // Si se proporciona un dictatorId como parámetro, actualiza la relación
    if (dictatorId) {
      const dictator = await this.dictatorRepository.findOne({
        where: { id: dictatorId },
      });
      if (!dictator) {
        throw new NotFoundException(`Dictator with ID ${dictatorId} not found`);
      }
      slave.dictator = dictator;
    }
  
    // Actualiza las otras propiedades del esclavo
    Object.assign(slave, updateSlaveDto);
  
    // Guarda los cambios
    const updatedSlave = await this.slaveRepository.save(slave);
  
    // Si cambió el dictador, actualiza los contadores
    if (dictatorId && dictatorId !== previousDictatorId) {
      await this.dictatorsService.updateNumberOfSlaves(dictatorId); // Nuevo dictador
      if (previousDictatorId) {
        await this.dictatorsService.updateNumberOfSlaves(previousDictatorId); // Dictador anterior
      }
    }
  
    return updatedSlave;
  }

  async remove(id: string): Promise<void> {

    const slave = await this.findOne(id); // Busca el esclavo para obtener el dictatorId
    if (!slave) {
      throw new NotFoundException(`Slave with ID ${id} not found`);
    }
    // Obtiene el ID del Dictator asociado al Slave, si existe. Usa optional chaining (?.) para evitar errores si dictator es null.
    const dictatorId = slave.dictator?.id;
    const result = await this.slaveRepository.delete({ id });

    // Actualiza el contador de esclavos del dictador, solo si el esclavo tiene un dictador
    if (dictatorId) {
      await this.dictatorsService.updateNumberOfSlaves(dictatorId);
    }
  }

  async getBattles(slaveId: string): Promise<Battle[]> {
    // Buscar batallas donde el esclavo sea cons1 o cons2
    const battles = await this.battleRepository.find({
      where: [
        { cons1: { id: slaveId } }, // Esclavo como cons1
        { cons2: { id: slaveId } }, // Esclavo como cons2
      ],
      relations: ['cons1', 'cons2', 'winner', 'deadSlave'], // Cargar relaciones
    });

    return battles;
  }

}
