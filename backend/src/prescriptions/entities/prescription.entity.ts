import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../users/entities/patient.entity';
import { PrescriptionItem } from './prescription-item.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'patient_id', type: 'uuid', nullable: true })
  patientId?: string;

  @ManyToOne(() => Patient, { nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @Column({ name: 'patient_first_name', nullable: true })
  patientFirstName?: string;

  @Column({ name: 'patient_last_name', nullable: true })
  patientLastName?: string;

  @Column({ name: 'patient_date_of_birth', type: 'date', nullable: true })
  patientDateOfBirth?: Date;

  @Column({ name: 'patient_phone', nullable: true })
  patientPhone?: string;

  @Column({ name: 'consultation_id', type: 'uuid', nullable: true })
  consultationId?: string;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription)
  items: PrescriptionItem[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'doctor_name' })
  doctorName: string;

  @Column({ name: 'doctor_specialty', nullable: true })
  doctorSpecialty?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}