import axios from "axios";

type AppointmentType = "Consultation" | "Suivi" | "Urgence" | "Bilan";

interface Appointment {
  id: string;
  patient: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  type: AppointmentType;
}

const API_URL = "http://localhost:4000/appointments";

export const getAppointments = async (): Promise<Appointment[]> => {
  const res = await axios.get<Appointment[]>(API_URL);
  return res.data;
};

export const createAppointment = async (appt: Omit<Appointment, "id">): Promise<Appointment> => {
  const res = await axios.post<Appointment>(API_URL, appt);
  return res.data;
};

export const updateAppointment = async (id: string, appt: Partial<Appointment>): Promise<Appointment> => {
  const res = await axios.patch<Appointment>(`${API_URL}/${id}`, appt);
  return res.data;
};

// src/app/agenda/data/appointments.ts
export const deleteAppointment = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await axios.delete<{ success: boolean; message: string }>(`${API_URL}/${id}`);
  return res.data;
};