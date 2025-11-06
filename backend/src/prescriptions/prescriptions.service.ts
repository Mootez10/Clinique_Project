import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,
  ) {}

  async create(createDto: CreatePrescriptionDto): Promise<Prescription> {
    // Validation
    if (!createDto.patientId && (!createDto.patientFirstName || !createDto.patientLastName)) {
      throw new BadRequestException('Patient information required');
    }

    // Créer la prescription
    const prescription = new Prescription();
    prescription.date = new Date(createDto.date);
    
    // ✅ FIX : Utiliser undefined au lieu de null et vérifier les types
    prescription.patientId = createDto.patientId || undefined;
    prescription.patientFirstName = createDto.patientFirstName || undefined;
    prescription.patientLastName = createDto.patientLastName || undefined;
    prescription.patientDateOfBirth = createDto.patientDateOfBirth 
      ? new Date(createDto.patientDateOfBirth) 
      : undefined;
    prescription.patientPhone = createDto.patientPhone || undefined;
    prescription.consultationId = createDto.consultationId || undefined;
    prescription.notes = createDto.notes || undefined;
    prescription.doctorName = createDto.doctorName;
    prescription.doctorSpecialty = createDto.doctorSpecialty || undefined;

    // Sauvegarder la prescription
    const saved = await this.prescriptionRepository.save(prescription);

    // Sauvegarder les items
    if (createDto.items && createDto.items.length > 0) {
      const items = createDto.items.map(item => {
        const prescriptionItem = new PrescriptionItem();
        prescriptionItem.prescriptionId = saved.id;
        prescriptionItem.medicationName = item.medicationName;
        prescriptionItem.dosage = item.dosage;
        prescriptionItem.frequency = item.frequency;
        prescriptionItem.duration = item.duration;
        prescriptionItem.instructions = item.instructions || undefined;
        return prescriptionItem;
      });

      await this.prescriptionItemRepository.save(items);
    }

    // Retourner la prescription complète
    return this.findOne(saved.id);
  }

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionRepository.find({
      relations: ['patient', 'items'],
      order: { date: 'DESC' as const },
    });
  }

  async findOne(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['patient', 'items'],
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription ${id} not found`);
    }

    return prescription;
  }

  async findByPatient(patientId: string): Promise<Prescription[]> {
    return this.prescriptionRepository.find({
      where: { patientId },
      relations: ['patient', 'items'],
      order: { date: 'DESC' as const },
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.prescriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Prescription ${id} not found`);
    }
  }
}