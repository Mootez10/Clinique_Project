import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  patientId: string;

  @IsString()
  patientName: string;

  @IsOptional()
  @IsNumber()
  patientAge?: number;

  @IsOptional()
  @IsString()
  patientGender?: string;

  @IsString()
  motif: string;

  @IsOptional()
  @IsString()
  antecedents?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  poids?: number;

  @IsOptional()
  @IsNumber()
  taille?: number;

  @IsOptional()
  @IsString()
  tensionArterielle?: string;

  @IsOptional()
  @IsNumber()
  frequenceCardiaque?: number;

  @IsOptional()
  @IsString()
  symptomes?: string;

  @IsOptional()
  @IsString()
  diagnostic?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  @IsString()
  examensComplimentaires?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  medecinId: string;

  @IsString()
  medecinName: string;

  @IsDateString()
  dateConsultation: string;

  @IsOptional()
  @IsEnum(['en_cours', 'terminee', 'annulee'])
  statut?: string;
}