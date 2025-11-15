// frontend/types/clinique.ts

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RECEP = 'RECEP',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
}

export interface Doctor extends User {
  role: UserRole.DOCTOR;
  specialization?: string;
}

export interface Receptionist extends User {
  role: UserRole.RECEP;
}

export interface Clinique {
  description: any;
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  addedby?: Admin;
  receptionists?: Receptionist[];
  doctors?: Doctor[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCliniqueDto {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface UpdateCliniqueDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface AssignUserCliniqueDto {
  cliniqueId: string;
  role: UserRole.DOCTOR | UserRole.RECEP;
  userIds: string[];
}