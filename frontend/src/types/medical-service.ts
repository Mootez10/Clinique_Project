export interface MedicalService {
  id: string;
  name: string;
  description: string;
  price: number | string;  // Accepte les deux
  duration: number;
  isActive: boolean;
  clinique: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface CreateMedicalServiceDto {
  name: string;
  description: string;
  price: number;
  duration?: number;
  cliniqueId: string;
}

export interface UpdateMedicalServiceDto extends Partial<CreateMedicalServiceDto> {
  isActive?: boolean;
}