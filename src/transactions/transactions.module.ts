import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { Dictator } from 'src/dictators/entities/dictator.entity';
import { DictatorsModule } from '../dictators/dictators.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    TypeOrmModule.forFeature([Transaction, Dictator]), DictatorsModule,
    forwardRef(() => DictatorsModule), 
  ],
  exports: [TypeOrmModule],
})
export class TransactionsModule {}
