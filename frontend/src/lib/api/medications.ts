import { Medication, CreateMedicationDto, UpdateMedicationDto } from '@/types/medication';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface MedicationStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
  totalValue: number;
}

class MedicationsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'MedicationsApiError';
  }
}

export const medicationsApi = {
  async getAll(search?: string, category?: string): Promise<Medication[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const url = `${API_URL}/medications${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new MedicationsApiError(
          `Erreur ${response.status}: ${errorText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de se connecter au serveur');
    }
  },

  async getStats(): Promise<MedicationStats> {
    try {
      const response = await fetch(`${API_URL}/medications/stats`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new MedicationsApiError(
          `Erreur ${response.status}: ${errorText}`,
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de récupérer les statistiques');
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/medications/categories`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        console.warn(`Categories API returned ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (!Array.isArray(data)) return [];

      return data
        .filter((c: any): c is string => typeof c === 'string' && c.trim().length > 0)
        .map(c => c.trim())
        .filter((value, index, self) => self.indexOf(value) === index);
    } catch (error) {
      console.warn('getCategories failed, using defaults');
      return [];
    }
  },

  async getLowStock(): Promise<Medication[]> {
    try {
      const response = await fetch(`${API_URL}/medications/low-stock`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new MedicationsApiError(
          `Erreur ${response.status}: ${errorText}`,
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de récupérer les stocks bas');
    }
  },

  async getOutOfStock(): Promise<Medication[]> {
    try {
      const response = await fetch(`${API_URL}/medications/out-of-stock`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new MedicationsApiError(
          `Erreur ${response.status}: ${errorText}`,
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de récupérer les ruptures de stock');
    }
  },

  async getExpiringSoon(): Promise<Medication[]> {
    try {
      const response = await fetch(`${API_URL}/medications/expiring-soon`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new MedicationsApiError(
          `Erreur ${response.status}: ${errorText}`,
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de récupérer les médicaments expirant bientôt');
    }
  },

  async getOne(id: number): Promise<Medication> {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new MedicationsApiError(
          `Erreur ${response.status}: ${errorText}`,
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de récupérer le médicament');
    }
  },

  async create(data: CreateMedicationDto): Promise<Medication> {
    try {
      const response = await fetch(`${API_URL}/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MedicationsApiError(
          errorData.message || 'Erreur lors de la création',
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de créer le médicament');
    }
  },

  async update(id: number, data: UpdateMedicationDto): Promise<Medication> {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MedicationsApiError(
          errorData.message || 'Erreur lors de la modification',
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de modifier le médicament');
    }
  },

  async updateStock(id: number, quantity: number): Promise<Medication> {
    try {
      const response = await fetch(`${API_URL}/medications/${id}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MedicationsApiError(
          errorData.message || 'Erreur lors de la mise à jour du stock',
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de mettre à jour le stock');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MedicationsApiError(
          errorData.message || 'Erreur lors de la suppression',
          response.status
        );
      }
    } catch (error) {
      if (error instanceof MedicationsApiError) throw error;
      throw new MedicationsApiError('Impossible de supprimer le médicament');
    }
  },
};