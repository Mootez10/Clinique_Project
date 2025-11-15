import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
    });
    if (!equipment) {
      throw new NotFoundException(`Équipement #${id} non trouvé`);
    }
    return equipment;
  }

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = this.equipmentRepository.create({
      ...createEquipmentDto,
      isActive: createEquipmentDto.isActive !== undefined ? createEquipmentDto.isActive : true,
    });
    return this.equipmentRepository.save(equipment);
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.findOne(id);
    if (!equipment) {
      throw new NotFoundException(`Équipement #${id} non trouvé`);
    }
    
    // Mise à jour avec merge pour éviter les problèmes de relations
    const updatedEquipment = this.equipmentRepository.merge(equipment, updateEquipmentDto);
    return this.equipmentRepository.save(updatedEquipment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.equipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Équipement #${id} non trouvé`);
    }
  }

  async getLowStock(): Promise<Equipment[]> {
    return this.equipmentRepository
      .createQueryBuilder('equipment')
      .where('equipment.quantity <= equipment.minStock')
      .andWhere('equipment.isActive = :isActive', { isActive: true })
      .getMany();
  }
}