import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  @Index()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column('int')
  minStock: number;

  @Column('int')
  maxStock: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  supplier: string;

  @Column({ type: 'date' })
  @Index()
  expirationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Nettoyage automatique des espaces
  @BeforeInsert()
  @BeforeUpdate()
  trimFields() {
    this.name = this.name?.trim();
    this.description = this.description?.trim() || null;
    this.category = this.category?.trim() || '';
    this.supplier = this.supplier?.trim();
  }

  getStockStatus(): 'LOW' | 'NORMAL' | 'HIGH' | 'OUT_OF_STOCK' {
    if (this.quantity === 0) return 'OUT_OF_STOCK';
    if (this.quantity <= this.minStock) return 'LOW';
    if (this.quantity >= this.maxStock * 0.8) return 'HIGH';
    return 'NORMAL';
  }
}