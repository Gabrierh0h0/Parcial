import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Dictator } from '../dictators/entities/dictator.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Dictator)
    private readonly dictatorRepository: Repository<Dictator>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Validar el comprador
    const buyer = await this.dictatorRepository.findOne({ where: { id: createTransactionDto.buyer } });
    if (!buyer) {
      throw new NotFoundException(`Dictator with ID ${createTransactionDto.buyer} not found for buyer`);
    }

    // Validar el vendedor
    const seller = await this.dictatorRepository.findOne({ where: { id: createTransactionDto.seller } });
    if (!seller) {
      throw new NotFoundException(`Dictator with ID ${createTransactionDto.seller} not found for seller`);
    }

    const transaction = this.transactionRepository.create({
      buyer,
      seller,
      item: createTransactionDto.item,
      amount: createTransactionDto.amount,
      status: createTransactionDto.status,
    });

    return this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({ relations: ['buyer', 'seller'] });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['buyer', 'seller'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);

    if (updateTransactionDto.buyer) {
      const buyer = await this.dictatorRepository.findOne({ where: { id: updateTransactionDto.buyer } });
      if (!buyer) {
        throw new NotFoundException(`Dictator with ID ${updateTransactionDto.buyer} not found for buyer`);
      }
      transaction.buyer = buyer;
    }

    if (updateTransactionDto.seller) {
      const seller = await this.dictatorRepository.findOne({ where: { id: updateTransactionDto.seller } });
      if (!seller) {
        throw new NotFoundException(`Dictator with ID ${updateTransactionDto.seller} not found for seller`);
      }
      transaction.seller = seller;
    } else if (updateTransactionDto.seller === null) {
      transaction.seller = null; // Permitir eliminar el vendedor
    }

    if (updateTransactionDto.item !== undefined) transaction.item = updateTransactionDto.item;
    if (updateTransactionDto.amount !== undefined) transaction.amount = updateTransactionDto.amount;
    if (updateTransactionDto.status !== undefined) transaction.status = updateTransactionDto.status;

    return this.transactionRepository.save(transaction);
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionRepository.delete(id);
  }
}