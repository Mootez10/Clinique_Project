import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  create(dto: CreateAppointmentDto) {
    const appt = this.appointmentRepo.create(dto);
    return this.appointmentRepo.save(appt);
  }

  findAll() {
    return this.appointmentRepo.find({
      order: { date: 'ASC' },
    });
  }

  async findOne(id: string) {
    const appt = await this.appointmentRepo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException(`Rendez-vous ${id} introuvable`);
    return appt;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const appt = await this.findOne(id);
    Object.assign(appt, dto);
    return this.appointmentRepo.save(appt);
  }


async remove(id: string) {
  await this.appointmentRepo.delete(id);
  return { success: true, message: "Rendez-vous supprimé avec succès" };
}
}
