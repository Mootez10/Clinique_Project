// lib/api/medical-service.ts
import { MedicalService, CreateMedicalServiceDto, UpdateMedicalServiceDto } from '@/types/medical-service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class MedicalServiceApi {
  private getHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async create(data: CreateMedicalServiceDto): Promise<MedicalService> {
    const response = await fetch(`${API_URL}/medical-services`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la création du service');
    }

    return response.json();
  }

  async getAll(cliniqueId?: string): Promise<MedicalService[]> {
    const url = cliniqueId
      ? `${API_URL}/medical-services?cliniqueId=${cliniqueId}`
      : `${API_URL}/medical-services`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Échec du chargement des services');
    }

    return response.json();
  }

  async getById(id: string): Promise<MedicalService> {
    const response = await fetch(`${API_URL}/medical-services/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Service non trouvé');
    }

    return response.json();
  }

  async update(id: string, data: UpdateMedicalServiceDto): Promise<MedicalService> {
    const response = await fetch(`${API_URL}/medical-services/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la mise à jour');
    }

    return response.json();
  }

  async toggleActive(id: string): Promise<MedicalService> {
    const response = await fetch(`${API_URL}/medical-services/${id}/toggle-active`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Échec du changement de statut');
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/medical-services/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la suppression');
    }
  }
}

export const medicalServiceApi = new MedicalServiceApi();