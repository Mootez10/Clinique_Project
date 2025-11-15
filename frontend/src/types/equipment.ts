// types/equipment.ts
export interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentRequest {
  name: string;
  description?: string;
  category: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  supplier?: string;
  location?: string;
  isActive?: boolean;
}

export interface UpdateEquipmentRequest {
  name?: string;
  description?: string;
  category?: string;
  quantity?: number;
  minStock?: number;
  unitPrice?: number;
  supplier?: string;
  location?: string;
  isActive?: boolean;
}