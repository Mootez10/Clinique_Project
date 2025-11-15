import { TimeStamEntity } from "src/database/timestamp-entity";
import { Admin } from "src/users/entities/admin.entity";
import { Doctor } from "src/users/entities/doctor.entity";
import { Receptionist } from "src/users/entities/receptioniste.entity";

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MedicalService } from "src/medical-services/entities/medical-service.entity";


@Entity()
export class Clinique extends TimeStamEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string;
    @Column({unique: true})
    name : string;
    @Column()
    address : string;
    @Column({ unique: true })
    phone : string;
    @Column({ unique: true })
    email : string;
    @ManyToOne(() => Admin)
    addedby : Admin;
    @OneToMany(() => Receptionist, (recep) => recep.clinique)
    receptionists: Receptionist[];
    @OneToMany(() => Doctor, (doctor) => doctor.clinique)
    doctors: Doctor[];
    
// Ajouter dans la classe Clinique
@OneToMany(() => MedicalService, (service) => service.clinique)
services: MedicalService[];
stockItems: any;


}
