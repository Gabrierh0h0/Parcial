import { Slave } from "src/slaves/entities/slave.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Dictator')
export class Dictator {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false,
        unique: true,
    })
    name:string;

    @Column('text',{
        nullable:false,
        default:"Denver Colorado",
    })
    territory:string;

    @Column('numeric',{
        nullable:false,
        default:0
    })
    number_slaves?:number;
    
    @Column('numeric',{
        nullable:false,
        default:1,
    })
    loyalty:number;

    @OneToMany(() => Slave, (slave) => slave.dictator)
    slaves: Slave[];

    @OneToMany(() => Transaction, (transaction) => transaction.buyer)
    transactionsAsBuyer: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.seller)
    transactionsAsSeller: Transaction[];

    @Column('text',{
        nullable:false,
    })
    password:string;
}
