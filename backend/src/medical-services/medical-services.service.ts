import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalService } from './entities/medical-service.entity';
import { CreateMedicalServiceDto } from './dto/create-medical-service.dto';
import { UpdateMedicalServiceDto } from './dto/update-medical-service.dto';
import { CliniqueService } from 'src/clinique/clinique.service';

@Injectable()
export class MedicalServicesService {
  constructor(
    @InjectRepository(MedicalService)
    private medicalServiceRepository: Repository<MedicalService>,
    private readonly cliniqueService: CliniqueService,
  ) {}

  async create(createMedicalServiceDto: CreateMedicalServiceDto) {
    const clinique = await this.cliniqueService.findOne(
      createMedicalServiceDto.cliniqueId,
    );
    if (!clinique) {
      throw new NotFoundException('Clinique not found');
    }

    const medicalService = this.medicalServiceRepository.create({
      ...createMedicalServiceDto,
      clinique,
    });

    return await this.medicalServiceRepository.save(medicalService);
  }

  async findAll() {
    return await this.medicalServiceRepository.find({
      relations: { clinique: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByClinic(cliniqueId: string) {
    return await this.medicalServiceRepository.find({
      where: { clinique: { id: cliniqueId } },
      relations: { clinique: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const service = await this.medicalServiceRepository.findOne({
      where: { id },
      relations: { clinique: true },
    });

    if (!service) {
      throw new NotFoundException('Medical service not found');
    }

    return service;
  }

  async update(id: string, updateMedicalServiceDto: UpdateMedicalServiceDto) {
    const service = await this.findOne(id);

    if (updateMedicalServiceDto.cliniqueId) {
      const clinique = await this.cliniqueService.findOne(
        updateMedicalServiceDto.cliniqueId,
      );
      Object.assign(service, { ...updateMedicalServiceDto, clinique });
    } else {
      Object.assign(service, updateMedicalServiceDto);
    }

    return await this.medicalServiceRepository.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    return await this.medicalServiceRepository.remove(service);
  }

  async toggleActive(id: string) {
    const service = await this.findOne(id);
    service.isActive = !service.isActive;
    return await this.medicalServiceRepository.save(service);
  }
}