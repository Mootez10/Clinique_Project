import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MedicalServicesService } from './medical-services.service';
import { CreateMedicalServiceDto } from './dto/create-medical-service.dto';
import { UpdateMedicalServiceDto } from './dto/update-medical-service.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { userRole } from 'src/users/entities/user.entity';

@Controller('medical-services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalServicesController {
  constructor(
    private readonly medicalServicesService: MedicalServicesService,
  ) {}

  @Post()
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  create(@Body() createMedicalServiceDto: CreateMedicalServiceDto) {
    return this.medicalServicesService.create(createMedicalServiceDto);
  }

  @Get()
  findAll(@Query('cliniqueId') cliniqueId?: string) {
    if (cliniqueId) {
      return this.medicalServicesService.findByClinic(cliniqueId);
    }
    return this.medicalServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalServicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMedicalServiceDto: UpdateMedicalServiceDto,
  ) {
    return this.medicalServicesService.update(id, updateMedicalServiceDto);
  }

  @Patch(':id/toggle-active')
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalServicesService.toggleActive(id);
  }

  @Delete(':id')
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalServicesService.remove(id);
  }
}