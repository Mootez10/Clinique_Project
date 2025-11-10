// frontend/lib/api/clinique.ts

import { Clinique, CreateCliniqueDto, UpdateCliniqueDto, AssignUserCliniqueDto } from '@/types/clinique';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function for API calls
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const cliniqueApi = {
  // Get all cliniques
  getAll: async (): Promise<Clinique[]> => {
    return fetchAPI<Clinique[]>('/clinique');
  },

  // Get single clinique
  getOne: async (id: string): Promise<Clinique> => {
    return fetchAPI<Clinique>(`/clinique/${id}`);
  },

  // Create clinique
  create: async (data: CreateCliniqueDto): Promise<Clinique> => {
    return fetchAPI<Clinique>('/clinique', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update clinique
  update: async (id: string, data: UpdateCliniqueDto): Promise<Clinique> => {
    return fetchAPI<Clinique>(`/clinique/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete clinique
  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/clinique/${id}`, {
      method: 'DELETE',
    });
  },

  // Assign users to clinique
  assignUsers: async (data: AssignUserCliniqueDto): Promise<Clinique> => {
    return fetchAPI<Clinique>('/clinique/assign-user', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};