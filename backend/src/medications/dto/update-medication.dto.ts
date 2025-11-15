import { 
  IsString, 
  IsNumber, 
  IsDateString, 
  IsBoolean, 
  IsOptional, 
  Min, 
  IsPositive,
  Max,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ name: 'minMaxStockUpdate', async: false })
export class MinMaxStockUpdateConstraint implements ValidatorConstraintInterface {
  validate(minStock: number, args: ValidationArguments) {
    const object = args.object as any;
    if (minStock && object.maxStock) {
      return minStock <= object.maxStock;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Le stock minimum ne peut pas être supérieur au stock maximum';
  }
}

export class UpdateMedicationDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsNumber()
  @Min(0)
  @Max(10000)
  @IsOptional()
  readonly price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly quantity?: number;

  @IsNumber()
  @Min(0)
  @Validate(MinMaxStockUpdateConstraint)
  @IsOptional()
  readonly minStock?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly maxStock?: number;

  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;

  @IsString()
  @IsOptional()
  readonly supplier?: string;

  @IsDateString()
  @IsOptional()
  readonly expirationDate?: string;
}