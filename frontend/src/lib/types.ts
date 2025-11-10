//apartient au crud des utilisateurs
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
  phone?: string;
  password: string;
  role: UserRole;
  clinique?: any; // Pour les docteurs et réceptionnistes
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  cliniqueId?: string; // Optionnel pour l'assignation à une clinique
}
