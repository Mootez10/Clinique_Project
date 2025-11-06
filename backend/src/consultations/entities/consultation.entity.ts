import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informations du patient
  @Column()
  patientId: string; // ID du patient (si vous avez une table patients)

  @Column()
  patientName: string; // Nom du patient

  @Column({ nullable: true })
  patientAge: number;

  @Column({ nullable: true })
  patientGender: string; // 'M', 'F', 'Autre'

  // Informations de consultation
  @Column({ type: 'text' })
  motif: string; // Raison de la visite

  @Column({ type: 'text', nullable: true })
  antecedents: string; // Historique médical

  // Examen clinique
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number; // Température en °C

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  poids: number; // Poids en kg

  @Column({ type: 'integer', nullable: true })
  taille: number; // Taille en cm

  @Column({ nullable: true })
  tensionArterielle: string; // Ex: "120/80"

  @Column({ type: 'integer', nullable: true })
  frequenceCardiaque: number; // Battements/min

  @Column({ type: 'text', nullable: true })
  symptomes: string; // Description des symptômes

  // Diagnostic et traitement
  @Column({ type: 'text', nullable: true })
  diagnostic: string;

  @Column({ type: 'text', nullable: true })
  prescription: string; // Médicaments prescrits

  @Column({ type: 'text', nullable: true })
  examensComplimentaires: string; // Analyses, radiographies

  @Column({ type: 'text', nullable: true })
  notes: string; // Notes du médecin

  // Informations administratives
  @Column()
  medecinId: string; // ID du médecin

  @Column()
  medecinName: string; // Nom du médecin

  @Column({ type: 'date' })
  dateConsultation: Date;

  @Column({ default: 'en_cours' })
  statut: string; // 'en_cours', 'terminee', 'annulee'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}