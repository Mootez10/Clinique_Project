import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patient: string;

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ default: 'Consultation' })
  type: string;
}
