import { 
  IsString, 
  IsNumber, 
  IsDateString, 
  IsNotEmpty, 
  Min, 
  IsOptional, 
  IsPositive,
  Max,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ name: 'minMaxStock', async: false })
export class MinMaxStockConstraint implements ValidatorConstraintInterface {
  validate(minStock: number, args: ValidationArguments) {
    const object = args.object as any;
    return minStock <= object.maxStock;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Le stock minimum ne peut pas être supérieur au stock maximum';
  }
}

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsNotEmpty({ message: 'La catégorie est requise' })
  readonly category: string;

  @IsNumber()
  @Min(0, { message: 'Le prix doit être positif' })
  @Max(10000, { message: 'Le prix ne peut pas dépasser 10000€' })
  readonly price: number;

  @IsNumber()
  @Min(0, { message: 'La quantité doit être positive' })
  @IsPositive({ message: 'La quantité doit être positive' })
  readonly quantity: number;

  @IsNumber()
  @Min(0, { message: 'Le stock minimum doit être positif' })
  @Validate(MinMaxStockConstraint)
  readonly minStock: number;

  @IsNumber()
  @Min(0, { message: 'Le stock maximum doit être positif' })
  readonly maxStock: number;

  @IsString()
  @IsNotEmpty({ message: 'Le fournisseur est requis' })
  readonly supplier: string;

  @IsDateString()
  readonly expirationDate: string;
}