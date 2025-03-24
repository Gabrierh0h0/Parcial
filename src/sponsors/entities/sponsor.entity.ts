import { Slave } from "src/slaves/entities/slave.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Sponsor')
export class Sponsor {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false,
    })
    company_name:string;

    @Column('text',{
        nullable:false,
    })
    donated_items:string;

    @ManyToOne(() => Slave, (slave) => slave.sponsors, { nullable: true })
    slave: Slave; // Un Sponsor tiene un Slave
}
