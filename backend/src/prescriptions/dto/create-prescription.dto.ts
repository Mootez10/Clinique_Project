import { IsString, IsUUID, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescriptionItemDto {
  @IsString()
  medicationName: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsString()
  duration: string;

  @IsString()
  @IsOptional()
  instructions?: string;
}

export class CreatePrescriptionDto {
  @IsDateString()
  date: string;

  @IsUUID()
  @IsOptional()
  patientId?: string;

  @IsString()
  @IsOptional()
  patientFirstName?: string;

  @IsString()
  @IsOptional()
  patientLastName?: string;

  @IsDateString()
  @IsOptional()
  patientDateOfBirth?: string;

  @IsString()
  @IsOptional()
  patientPhone?: string;

  @IsUUID()
  @IsOptional()
  consultationId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items: CreatePrescriptionItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  doctorName: string;

  @IsString()
  @IsOptional()
  doctorSpecialty?: string;
}