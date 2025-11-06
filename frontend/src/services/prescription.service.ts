// src/services/prescription.service.ts
import axios from 'axios';
import { Prescription, CreatePrescriptionDto } from '@/types/prescription';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Vérifie que l'URL est bien définie
if (!API_URL) {
  console.warn('API_URL non définie, utilisation de localhost:3001');
}

export const prescriptionService = {
  create: async (data: CreatePrescriptionDto): Promise<Prescription> => {
    const response = await axios.post<Prescription>(`${API_URL}/prescriptions`, data);
    return response.data;
  },

  getAll: async (): Promise<Prescription[]> => {
    const response = await axios.get<Prescription[]>(`${API_URL}/prescriptions`);
    return response.data;
  },

  getById: async (id: string): Promise<Prescription> => {
    const response = await axios.get<Prescription>(`${API_URL}/prescriptions/${id}`);
    return response.data;
  },

  getByPatient: async (patientId: string): Promise<Prescription[]> => {
    const response = await axios.get<Prescription[]>(`${API_URL}/prescriptions/patient/${patientId}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/prescriptions/${id}`);
  },
};