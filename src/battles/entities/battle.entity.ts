import { Slave } from "src/slaves/entities/slave.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";


@Entity('Battle')
export class Battle {
    
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Slave, (slave) => slave.battles, { nullable: false })
  cons1: Slave; 

  @ManyToOne(() => Slave, (slave) => slave.battles, { nullable: false })
  cons2: Slave; 

  @ManyToOne(() => Slave, (slave) => slave.battlesAsWinner, { nullable: true })
  winner?: Slave; 

  get contestants(): Slave[] {
    return [this.cons1, this.cons2]; //Unimos los contrincantes en un solo arreglo, para slaves
  }

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  death?: boolean;

  @OneToOne(() => Slave, { nullable: true })
  deadSlave?: Slave; // Esclavo que murió (null si no hubo muerte)

  @Column('text', {
    nullable: false,
  })
  injuries: string; 

  @Column('date', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date?: Date; 
}
