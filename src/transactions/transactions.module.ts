import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
    imports: [TypeOrmModule.forFeature([Transaction])],
  
})
export class TransactionsModule {}
