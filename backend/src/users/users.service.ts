import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from "./entities/doctor.entity";
import { Patient } from "./entities/patient.entity";
import { Admin } from "./entities/admin.entity";
import { Receptionist } from "./entities/receptioniste.entity";
import { userRole } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Receptionist) private readonly recepRepo: Repository<Receptionist>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Doctor) private readonly doctorRepo: Repository<Doctor>,
  ) { }
  async getUsers(role?: userRole) {
    if (role === userRole.ADMIN) return this.adminRepo.find();
    if (role === userRole.RECEP) return this.recepRepo.find();
    if (role === userRole.PATIENT) return this.patientRepo.find();
    if (role === userRole.DOCTOR) return this.doctorRepo.find();
    return [
      ...(await this.adminRepo.find()),
      ...(await this.recepRepo.find()),
      ...(await this.patientRepo.find()),
      ...(await this.doctorRepo.find()),
    ]
  }
  async createReceptionist(userDto: CreateUserDto) {
    const existed = await this.recepRepo.existsBy([{ email: userDto.email }, { phone: userDto.phone }]);
    if (existed) {
      throw new ConflictException("User with this email or phone number already exists");
    }
    const createdUser = this.recepRepo.create({ ...userDto, role: userRole.RECEP });
    const savedUser = await this.recepRepo.save(createdUser);
    return savedUser;
  }

  async createPatient(userDto: CreateUserDto) {
    const existed = await this.patientRepo.existsBy([{ email: userDto.email }, { phone: userDto.phone }]);
    if (existed) {
      throw new ConflictException("User with this email or phone number already exists");
    }
    const createdUser = this.patientRepo.create({ ...userDto, role: userRole.PATIENT });
    const savedUser = await this.patientRepo.save(createdUser);
    return savedUser;
  }

  async createAdmin(userDto: CreateUserDto) {
    const existed = await this.adminRepo.existsBy([{ email: userDto.email }, { phone: userDto.phone }]);
    if (existed) {
      throw new ConflictException("User with this email or phone number already exists");
    }
    const createdUser = this.adminRepo.create({ ...userDto, role: userRole.ADMIN });
    const savedUser = await this.adminRepo.save(createdUser);
    return savedUser;
  }
  async createDoctor(userDto: CreateUserDto) {
    const existed = await this.doctorRepo.existsBy([{ email: userDto.email }, { phone: userDto.phone }]);
    if (existed) {
      throw new ConflictException("User with this email or phone number already exists");
    }
    const createdUser = this.doctorRepo.create({ ...userDto, role: userRole.DOCTOR });
    const savedUser = await this.doctorRepo.save(createdUser);
    return savedUser;
  }
  async findByEmail(email: string, role: userRole) {
    if (role === userRole.ADMIN) return await this.adminRepo.findOne({ where: { email } });
    if (role === userRole.RECEP) return await this.recepRepo.findOne({ where: { email } });
    if (role === userRole.PATIENT) return await this.patientRepo.findOne({ where: { email } });
    if (role === userRole.DOCTOR) return await this.doctorRepo.findOne({ where: { email } });
    throw new NotFoundException(`${role} with this email does not exist`);
  }

  async findUserById(id: string, role: userRole) {
    let user: Admin | Receptionist | Patient | Doctor | null = null;
    if (role === userRole.ADMIN) user = await this.adminRepo.findOne({ where: { id } });
    if (role === userRole.RECEP) user = await this.recepRepo.findOne({ where: { id } });
    if (role === userRole.PATIENT) user = await this.patientRepo.findOne({ where: { id } });
    if (role === userRole.DOCTOR) user = await this.doctorRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`${role} with this id does not exist`);
    return user;
  }
  async deleteUserById(id: string, role: userRole) {
    const user = await this.findUserById(id, role);
    let result;
    if (role === userRole.ADMIN) result = await this.adminRepo.delete(id);
    if (role === userRole.RECEP) result = await this.recepRepo.delete(id);
    if (role === userRole.PATIENT) result = await this.patientRepo.delete(id);
    if (role === userRole.DOCTOR) result = await this.doctorRepo.delete(id);
    if (result?.affected === 0) throw new NotFoundException("User with this id does not exist");
    return { message: `${role} deleted successfully` };
  }
}
