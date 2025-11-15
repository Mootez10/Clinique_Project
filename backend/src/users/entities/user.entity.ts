import { TimeStamEntity } from 'src/database/timestamp-entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';
import { Admin } from './admin.entity';
import { Receptionist } from './receptioniste.entity';
export enum userRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    RECEP = 'receptionist',
    DOCTOR = 'doctor',
    PATIENT = 'patient',
    RECEPTIONIST = "RECEPTIONIST",
}
export class User extends TimeStamEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column({ unique: true })
    email: string;
   @Column({ unique: true, nullable: true })
phone: string;

    @Column()
    password: string;
    @Column('enum', { enum: userRole })
    role: userRole;
}
