import { Injectable } from '@nestjs/common';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';

@Injectable()
export class DictatorsService {
  create(createDictatorDto: CreateDictatorDto) {
    return 'This action adds a new dictator';
  }

  findAll() {
    return `This action returns all dictators`;
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
