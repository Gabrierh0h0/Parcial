import { Dictator } from "src/dictators/entities/dictator.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Slave')
export class Slave {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false,
    })
    name:string;

    @Column('text',{
        unique:true,
        nullable:false,
    })
    nickname:string;

    @Column('text',{
        nullable:false,
    })
    origin:string;

    @Column('numeric',{
        nullable:false,
        default:1
    })
    strength:number;
    
    @Column('numeric',{
        nullable:false,
        default:1
    })
    agility:number;

    @Column('numeric',{
        nullable:false,
        default:0,
    })
    wins:number;

    @Column('numeric',{
        nullable:false,
        default:0,
    })
    losses:number;

    @Column('text',{
        nullable:true,
        default:"alive"
    })
    status?:string;

    @ManyToOne(() => Dictator, (dictator) => dictator.slaves, { onDelete: 'SET NULL', nullable: true })
    dictator: Dictator;

}
