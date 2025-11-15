import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

export interface MedicationStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
  totalValue: number;
}

@Injectable()
export class MedicationsService {
  private readonly logger = new Logger(MedicationsService.name);

  constructor(
    @InjectRepository(Medication)
    private medicationsRepository: Repository<Medication>,
  ) {}

  async findAll(search?: string, category?: string): Promise<Medication[]> {
    try {
      const query = this.medicationsRepository
        .createQueryBuilder('medication')
        .where('medication.isActive = :isActive', { isActive: true });

      if (search) {
        query.andWhere(
          '(medication.name ILIKE :search OR medication.description ILIKE :search OR medication.supplier ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (category) {
        query.andWhere('medication.category = :category', { category });
      }

      return await query.orderBy('medication.name', 'ASC').getMany();
    } catch (error) {
      this.logger.error('Erreur dans findAll:', error);
      return [];
    }
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationsRepository.findOne({
      where: { id, isActive: true },
    });

    if (!medication) {
      throw new NotFoundException(`Médicament avec ID ${id} non trouvé`);
    }

    return medication;
  }

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    if (createMedicationDto.minStock > createMedicationDto.maxStock) {
      throw new BadRequestException('Le stock minimum ne peut pas être supérieur au stock maximum');
    }

    const medication = this.medicationsRepository.create(createMedicationDto);
    return await this.medicationsRepository.save(medication);
  }

  async update(id: number, updateMedicationDto: UpdateMedicationDto): Promise<Medication> {
    const medication = await this.findOne(id);

    const newMinStock = updateMedicationDto.minStock ?? medication.minStock;
    const newMaxStock = updateMedicationDto.maxStock ?? medication.maxStock;

    if (newMinStock > newMaxStock) {
      throw new BadRequestException('Le stock minimum ne peut pas être supérieur au stock maximum');
    }

    Object.assign(medication, updateMedicationDto);
    return await this.medicationsRepository.save(medication);
  }

  async remove(id: number): Promise<void> {
    const medication = await this.findOne(id);
    medication.isActive = false;
    await this.medicationsRepository.save(medication);
  }

  async getLowStock(): Promise<Medication[]> {
    try {
      return await this.medicationsRepository
        .createQueryBuilder('medication')
        .where('medication.quantity <= medication.minStock')
        .andWhere('medication.isActive = :isActive', { isActive: true })
        .andWhere('medication.quantity > 0')
        .orderBy('medication.quantity', 'ASC')
        .getMany();
    } catch (error) {
      this.logger.error('Erreur dans getLowStock:', error);
      return [];
    }
  }

  async getOutOfStock(): Promise<Medication[]> {
    try {
      return await this.medicationsRepository.find({
        where: { quantity: 0, isActive: true },
        order: { name: 'ASC' },
      });
    } catch (error) {
      this.logger.error('Erreur dans getOutOfStock:', error);
      return [];
    }
  }

  async getExpiringSoon(): Promise<Medication[]> {
    try {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return await this.medicationsRepository.find({
        where: { 
          expirationDate: LessThanOrEqual(date), 
          isActive: true,
          quantity: MoreThan(0) // Seulement les médicaments qui ont encore du stock
        },
        order: { expirationDate: 'ASC' },
      });
    } catch (error) {
      this.logger.error('Erreur dans getExpiringSoon:', error);
      return [];
    }
  }

  async updateStock(id: number, quantity: number): Promise<Medication> {
    if (quantity < 0) {
      throw new BadRequestException('La quantité ne peut pas être négative');
    }

    const medication = await this.findOne(id);
    medication.quantity = quantity;
    return await this.medicationsRepository.save(medication);
  }

  async getStats(): Promise<MedicationStats> {
    try {
      const medications = await this.medicationsRepository.find({
        where: { isActive: true },
      });

      const lowStock = medications.filter(med => 
        med.quantity > 0 && med.quantity <= med.minStock
      );
      
      const outOfStock = medications.filter(med => med.quantity === 0);
      
      const now = new Date();
      const soon = new Date(now);
      soon.setDate(soon.getDate() + 30);
      const expiringSoon = medications.filter(med => {
        const exp = new Date(med.expirationDate);
        return exp <= soon && exp >= now && med.quantity > 0;
      });

      const totalValue = medications.reduce((sum, med) => {
        return sum + (parseFloat(med.price.toString()) * parseInt(med.quantity.toString()));
      }, 0);

      return {
        total: medications.length,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
        expiringSoon: expiringSoon.length,
        totalValue: parseFloat(totalValue.toFixed(2)),
      };
    } catch (error) {
      this.logger.error('Erreur dans getStats:', error);
      return { total: 0, lowStock: 0, outOfStock: 0, expiringSoon: 0, totalValue: 0 };
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const result = await this.medicationsRepository
        .createQueryBuilder('medication')
        .select('DISTINCT TRIM(medication.category)', 'category')
        .where('medication.isActive = :isActive', { isActive: true })
        .andWhere('medication.category IS NOT NULL')
        .andWhere('TRIM(medication.category) != :empty', { empty: '' })
        .orderBy('category', 'ASC')
        .getRawMany();

      return result
        .map(r => r.category)
        .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
        .map(c => c.trim())
        .filter((v, i, a) => a.indexOf(v) === i);
    } catch (error) {
      this.logger.error('getCategories error:', error);
      return [];
    }
  }
}