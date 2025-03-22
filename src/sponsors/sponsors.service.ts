import { Injectable } from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SponsorsService {

  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository:Repository<Sponsor>
  ) {}

  async create(createSponsorDto: CreateSponsorDto) {
    // Creamos la instancia del dish a partir del DTO
  const newSponsor = this.sponsorRepository.create(createSponsorDto);

  // Guardamos la instancia en la base de datos
  await this.sponsorRepository.save(newSponsor);
  return newSponsor;
  }

  async findAll() {
    const sponsor = await this.sponsorRepository.find({});
    return sponsor;  
  }

  findOne(id: number) {
    return `This action returns a #${id} sponsor`;
  }

  update(id: number, updateSponsorDto: UpdateSponsorDto) {
    return `This action updates a #${id} sponsor`;
  }

  remove(id: number) {
    return `This action removes a #${id} sponsor`;
  }
}
