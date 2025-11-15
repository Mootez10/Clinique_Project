import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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

export const equipmentApi = {
  getAll: () => api.get<Equipment[]>('/equipment'),
  getLowStock: () => api.get<Equipment[]>('/equipment/low-stock'),
  getById: (id: number) => api.get<Equipment>(`/equipment/${id}`),
  create: (data: CreateEquipmentRequest) => 
    api.post<Equipment>('/equipment', data),
  update: (id: number, data: UpdateEquipmentRequest) => 
    api.put<Equipment>(`/equipment/${id}`, data),
  delete: (id: number) => api.delete(`/equipment/${id}`),
};

// Fonction utilitaire pour gérer les erreurs
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return 'Erreur de connexion au serveur. Vérifiez que le serveur est démarré.';
  }
  return error.message || 'Une erreur inattendue est survenue';
};