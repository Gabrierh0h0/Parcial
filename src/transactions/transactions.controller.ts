import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { AuthGuard } from '@nestjs/passport';
import { AutenticadorGuard } from 'src/autenticador/autenticador.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @UseGuards(AuthGuard('jwt'), AutenticadorGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.transactionsService.remove(id);
  }
}