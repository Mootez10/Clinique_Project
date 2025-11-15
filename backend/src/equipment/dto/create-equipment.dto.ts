import { IsString, IsNumber, IsPositive, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  minStock: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsString()
  @IsOptional()
  supplier: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}