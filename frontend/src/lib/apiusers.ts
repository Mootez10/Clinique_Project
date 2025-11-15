import { User, CreateUserDto, UserRole } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('Making API request to:', url, options);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `API error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error('API Error details:', errorData);
          
          // Gestion spécifique des erreurs de validation
          if (errorData.message && Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(', ');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Si la réponse n'est pas du JSON, utiliser le texte brut
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }

  // Users
  async getUsers(role?: UserRole): Promise<User[]> {
    const query = role ? `?role=${role}` : '';
    return this.fetchApi(`/users${query}`);
  }

  async getUserById(id: string, role: UserRole): Promise<User> {
    return this.fetchApi(`/users/${role}/${id}`);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    // Validation du rôle
    if (!userData.role) {
      throw new Error('Role is required to create user');
    }

    const endpointMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: '/users/create-admin',
      [UserRole.SUPER_ADMIN]: '/users/create-admin',
      [UserRole.RECEP]: '/users/create-recep',
      [UserRole.PATIENT]: '/users/create-patient',
      [UserRole.DOCTOR]: '/users/create-doctor',
    };

    const endpoint = endpointMap[userData.role];
    
    if (!endpoint) {
      throw new Error(`No endpoint defined for role: ${userData.role}`);
    }

    console.log('Creating user with data:', userData);

    // Nettoyer les données avant envoi
    const cleanedData = {
      ...userData,
      phone: userData.phone ? userData.phone.replace(/\D/g, '') : undefined
    };

    return this.fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(cleanedData),
    });
  }

  async deleteUser(id: string, role: UserRole): Promise<void> {
    await this.fetchApi(`/users/${role}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();