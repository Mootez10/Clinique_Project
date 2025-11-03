import { TimeStamEntity } from 'src/database/timestamp-entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Patient extends User { }
