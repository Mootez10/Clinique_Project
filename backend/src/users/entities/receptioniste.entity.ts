import { Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
@Entity()
export class Receptionist extends User { }
