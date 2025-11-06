import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
  ) {}

  // Créer une consultation
  async create(createConsultationDto: CreateConsultationDto): Promise<Consultation> {
    const consultation = this.consultationRepository.create(createConsultationDto);
    return await this.consultationRepository.save(consultation);
  }

  // Récupérer toutes les consultations
  async findAll(): Promise<Consultation[]> {
    return await this.consultationRepository.find({
      order: { dateConsultation: 'DESC' }
    });
  }

  // Récupérer une consultation par ID
  async findOne(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({ where: { id } });
    if (!consultation) {
      throw new NotFoundException(`Consultation avec l'ID ${id} non trouvée`);
    }
    return consultation;
  }

  // Récupérer les consultations d'un patient
  async findByPatient(patientId: string): Promise<Consultation[]> {
    return await this.consultationRepository.find({
      where: { patientId },
      order: { dateConsultation: 'DESC' }
    });
  }

  // Mettre à jour une consultation
  async update(id: string, updateConsultationDto: UpdateConsultationDto): Promise<Consultation> {
    const consultation = await this.findOne(id);
    Object.assign(consultation, updateConsultationDto);
    return await this.consultationRepository.save(consultation);
  }

  // Supprimer une consultation
  async remove(id: string): Promise<void> {
    const consultation = await this.findOne(id);
    await this.consultationRepository.remove(consultation);
  }
}