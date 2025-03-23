import { Slave } from "src/slaves/entities/slave.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    number_slaves?:number;
    
    @Column('numeric',{
        nullable:false,
        default:1,
    })
    loyalty:number;

    @OneToMany(() => Slave, (slave) => slave.dictator)
    slaves: Slave[];
}