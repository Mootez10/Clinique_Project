// types/auth.ts
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  RECEP = 'receptionist',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Changé de number à string
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Déjà string - bon
  password: string;
}

export interface AuthResponse {
  redirectTo(redirectTo: any): unknown;
  token: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Changé de number à string
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoggedUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
}