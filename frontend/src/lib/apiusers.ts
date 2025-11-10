import { User, CreateUserDto, UserRole } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('🔄 Making API request to:', url, options);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', {
          url,
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('💥 Network error:', error);
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

    console.log('📤 Creating user with data:', userData);

    return this.fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

 

  async deleteUser(id: string, role: UserRole): Promise<void> {
    await this.fetchApi(`/users/${role}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();