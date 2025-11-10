// lib/api.ts
import type { LoginDto, RegisterDto, AuthResponse, LoggedUser } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      // Log pour débogage
      console.log('Register response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Raw error response:', errorText);
          
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        
        throw new Error(errorMessage);
      }

      const result: AuthResponse = await response.json();
      
      if (result.token) {
        this.setToken(result.token);
      }
      
      return result;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result: AuthResponse = await response.json();
      if (result.token) {
        this.setToken(result.token);
      }
      return result;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<LoggedUser> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/curr`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Failed to get current user: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiClient = new ApiClient(API_URL);