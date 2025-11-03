import { TimeStamEntity } from "src/database/timestamp-entity";
import { Admin } from "src/users/entities/admin.entity";
import { Doctor } from "src/users/entities/doctor.entity";
import { Receptionist } from "src/users/entities/receptioniste.entity";

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    @OneToMany((type) => Receptionist, (recep) => recep.clinique)
    receptionists: Receptionist[];
    @OneToMany((type) => Doctor, (doctor) => doctor.clinique)
    doctors: Doctor[];
}
