import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalServicesService } from './medical-services.service';
import { MedicalServicesController } from './medical-services.controller';
import { MedicalService } from './entities/medical-service.entity';
import { CliniqueModule } from 'src/clinique/clinique.module';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalService]), CliniqueModule],
  controllers: [MedicalServicesController],
  providers: [MedicalServicesService],
  exports: [MedicalServicesService],
})
export class MedicalServicesModule {}