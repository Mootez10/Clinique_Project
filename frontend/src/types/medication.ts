export interface Medication {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  isActive: boolean;
  supplier: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationDto {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  expirationDate: string;
}

export interface UpdateMedicationDto {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  minStock?: number;
  maxStock?: number;
  isActive?: boolean;
  supplier?: string;
  expirationDate?: string;
}