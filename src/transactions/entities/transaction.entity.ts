import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Transaction')
export class Transaction {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @PrimaryGeneratedColumn('uuid')
    buyer_id:string;

    @PrimaryGeneratedColumn('uuid')
    seller_id:string;

    @Column('text',{
        nullable:false,
    })
    item:string;

    @Column('numeric',{
        nullable:false,
        default:0
    })
    amount:number;

    @Column('text',{
        nullable:false,
    })
    status:string;
}

