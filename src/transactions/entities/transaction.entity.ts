import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Dictator } from 'src/dictators/entities/dictator.entity';

@Entity('Transaction')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Dictator, (dictator) => dictator.transactionsAsBuyer, { nullable: false })
  buyer: Dictator;

  @ManyToOne(() => Dictator, (dictator) => dictator.transactionsAsSeller, { nullable: true })
  seller: Dictator | null;

  @Column('text', { nullable: false })
  item: string;

  @Column('numeric', { nullable: false, default: 0 })
  amount: number;

  @Column('text', { nullable: false })
  status: string;
}