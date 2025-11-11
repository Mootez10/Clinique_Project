import { TimeStamEntity } from "src/database/timestamp-entity";
import { Clinique } from "src/clinique/entities/clinique.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MedicalService extends TimeStamEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ default: 30 })
    duration: number; // durée en minutes

    @Column({ default: true })
    isActive: boolean;
    
    @ManyToOne(() => Clinique, { onDelete: 'CASCADE' })
    clinique: Clinique;
}