import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patient: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsDateString()
  date: string;

  @IsString()
  type: string;
}
