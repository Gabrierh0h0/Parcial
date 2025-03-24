import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { Repository } from 'typeorm';
import { Slave } from 'src/slaves/entities/slave.entity';

@Injectable()
export class SponsorsService {

  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository: Repository<Sponsor>,
    @InjectRepository(Slave)
    private readonly slaveRepository: Repository<Slave>,
  ) {}

  async create(createSponsorDto: CreateSponsorDto) {
    // Busca el Slave
    const slave = await this.slaveRepository.findOne({
      where: { id: createSponsorDto.slaveId },
    });
    if (!slave) {
      throw new NotFoundException(`Slave with ID ${createSponsorDto.slaveId} not found`);
    }

    // Crea el Sponsor con el Slave
    const sponsor = this.sponsorRepository.create({
      company_name: createSponsorDto.company_name,
      donated_items: createSponsorDto.donated_items,
      slave,
    });

    // Guarda el Sponsor en la base de datos
    const savedSponsor = await this.sponsorRepository.save(sponsor);

    // Devuelve el Sponsor con los datos completos
    return this.findOne(savedSponsor.id);
  }

  async findAll() {
    return this.sponsorRepository.find({ relations: ['slave'] });
  }

  async findOne(id: string) {
    const sponsor = await this.sponsorRepository.findOne({ where: { id }, relations: ['slave'] });
    if (!sponsor) {
        throw new NotFoundException(`Sponsor with ID ${id} not found`);
    }
    return sponsor;
  }

  async update(id: string, updateSponsorDto: UpdateSponsorDto, slaveId?: string): Promise<Sponsor> {
    const sponsor = await this.findOne(id); // Busca el Sponsor existente

    // Si se proporciona un slaveId, actualiza la relación
    if (slaveId) {
      const slave = await this.slaveRepository.findOne({ where: { id: slaveId } });
      if (!slave) {
        throw new NotFoundException(`Slave with ID ${slaveId} not found`);
      }
      sponsor.slave = slave; // Asigna el nuevo Slave
    }

    // Actualiza las otras propiedades del Sponsor
    Object.assign(sponsor, updateSponsorDto);

    // Guarda los cambios
    const updatedSponsor = await this.sponsorRepository.save(sponsor);
   
    return updatedSponsor;
  }

  async remove(id: string) {
    return this.sponsorRepository.delete(id);
  }
}
