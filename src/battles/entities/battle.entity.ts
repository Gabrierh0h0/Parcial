import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Battle')
export class Battle {

    
    @PrimaryGeneratedColumn('uuid')
    id:string;

        
    @PrimaryGeneratedColumn('uuid')
    cons1:string;

        
    @PrimaryGeneratedColumn('uuid')
    cons2:string;

        
    @PrimaryGeneratedColumn('uuid')
    @Column('uuid',{
        nullable:true,
    })
    winner:string;

    @Column('boolean',{
        nullable:false,
    })
    death:boolean;

    @Column('text',{
        unique:true,
        nullable:false,
    })
    injuries:string;

    @Column('date',{
        nullable:false,
        default:()=> 'CURRENT_TIMESTAMP'
    })
    date:Date;
}
