import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository:Repository<Transaction>
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    // Creamos la instancia del dish a partir del DTO
  const newTransaction = this.transactionRepository.create(createTransactionDto);

  // Guardamos la instancia en la base de datos
  await this.transactionRepository.save(newTransaction);
  return newTransaction;
  }

  async findAll() {
    const slave = await this.transactionRepository.find({});
    return slave;  
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
