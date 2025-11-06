const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  motif: string;
  antecedents?: string;
  temperature?: number;
  poids?: number;
  taille?: number;
  tensionArterielle?: string;
  frequenceCardiaque?: number;
  symptomes?: string;
  diagnostic?: string;
  prescription?: string;
  examensComplimentaires?: string;
  notes?: string;
  medecinId: string;
  medecinName: string;
  dateConsultation: string;
  statut: string;
  createdAt: string;
  updatedAt: string;
}

export const consultationsApi = {
  // Créer une consultation
  async create(data: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Consultation> {
    const response = await fetch(`${API_URL}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors de la création');
    return response.json();
  },

  // Récupérer toutes les consultations
  async getAll(): Promise<Consultation[]> {
    const response = await fetch(`${API_URL}/consultations`);
    if (!response.ok) throw new Error('Erreur lors de la récupération');
    return response.json();
  },

  // Récupérer une consultation
  async getOne(id: string): Promise<Consultation> {
    const response = await fetch(`${API_URL}/consultations/${id}`);
    if (!response.ok) throw new Error('Consultation non trouvée');
    return response.json();
  },

  // Récupérer les consultations d'un patient
  async getByPatient(patientId: string): Promise<Consultation[]> {
    const response = await fetch(`${API_URL}/consultations/patient/${patientId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération');
    return response.json();
  },

  // Mettre à jour une consultation
  async update(id: string, data: Partial<Consultation>): Promise<Consultation> {
    const response = await fetch(`${API_URL}/consultations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour');
    return response.json();
  },

  // Supprimer une consultation
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/consultations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  },
};