import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
        default:0
    })
    strength:number;
    
    @Column('numeric',{
        nullable:false,
        default:0,
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
        nullable:false,
    })
    status:string;

}
