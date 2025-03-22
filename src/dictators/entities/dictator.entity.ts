import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Dictator')
export class Dictator {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false,
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
    number_slaves:number;
    
    @Column('numeric',{
        nullable:false,
        default:0,
    })
    loyalty:number;

}