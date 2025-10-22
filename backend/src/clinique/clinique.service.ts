import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCliniqueDto } from './dto/update-clinique.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinique } from './entities/clinique.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { userRole } from 'src/users/entities/user.entity';
import { AssignUserCliniqueDto } from './dto/assignuser-clinique.dto';
import { CreateCliniqueDto } from './dto/create-clinique.dto';
import { Receptionist } from 'src/users/entities/receptioniste.entity';
import { Doctor } from 'src/users/entities/doctor.entity';

@Injectable()
export class CliniqueService {
  constructor(
    @InjectRepository(Clinique) private cliniqueRepository: Repository<Clinique>,
    private readonly usersService: UsersService,
  ) {}
  async create(createCliniqueDto: CreateCliniqueDto , loggedUserId: string) {
    const user= await this.usersService.findUserById(loggedUserId, userRole.ADMIN);
    const exist = await this.cliniqueRepository.existsBy([{ name: createCliniqueDto.name }, { email: createCliniqueDto.email }, { phone: createCliniqueDto.phone }]);
    if (exist) throw new ConflictException("Clinique with this name, email or phone number already exists");
    const clinique = this.cliniqueRepository.create({...createCliniqueDto, addedby: user});
    return await this.cliniqueRepository.save(clinique);
  }

  async findAll() {
    return await this.cliniqueRepository.find();
  }

  async findAdminCreatedClinics(adminId: string) {
    return await this.cliniqueRepository.find({
      where: { addedby: { id: adminId } },
      relations: { addedby: true },
    });
  }

  async findOne(id: string) {
    const clinic = await this.cliniqueRepository.findOneBy({ id });
    if (!clinic) throw new NotFoundException("Clinique not found");
    return clinic;
  } 

 async update(id: string, updateCliniqueDto: UpdateCliniqueDto) {
    const clinic = await this.findOne(id);
    Object.assign(clinic, updateCliniqueDto);
    return this.cliniqueRepository.save(clinic);
  }


  async remove(id: string) {
    const clinic = await this.findOne(id);
    return this.cliniqueRepository.delete(id);
  }
}
