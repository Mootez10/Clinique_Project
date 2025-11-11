import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalServiceDto } from './create-medical-service.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMedicalServiceDto extends PartialType(CreateMedicalServiceDto) {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}