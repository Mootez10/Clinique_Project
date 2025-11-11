import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateMedicalServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    duration?: number; // durée en minutes (optionnel, défaut: 30)

    @IsUUID()
    @IsNotEmpty()
    cliniqueId: string;
}