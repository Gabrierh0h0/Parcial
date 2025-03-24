import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
