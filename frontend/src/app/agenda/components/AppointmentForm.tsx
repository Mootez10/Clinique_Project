// app/agenda/components/AppointmentForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface AppointmentFormProps {
  onSubmit: (appt: Appointment) => void;
  initialData?: Partial<Appointment>;
}

export default function AppointmentForm({ onSubmit, initialData }: AppointmentFormProps) {
  const [patient, setPatient] = useState(initialData?.patient ?? "");
  const [dob, setDob] = useState(initialData?.dob ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [date, setDate] = useState(initialData?.date ? initialData.date.slice(0, 10) : "");
  const [time, setTime] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().slice(11, 16) : ""
  );
  const [type, setType] = useState<AppointmentType>(initialData?.type ?? "Consultation");

  useEffect(() => {
    if (initialData) {
      setPatient(initialData.patient ?? "");
      setDob(initialData.dob ?? "");
      setPhone(initialData.phone ?? "");
      setEmail(initialData.email ?? "");
      setAddress(initialData.address ?? "");
      setDate(initialData.date ? initialData.date.slice(0, 10) : "");
      setTime(initialData.date ? new Date(initialData.date).toISOString().slice(11, 16) : "");
      setType((initialData.type as AppointmentType) ?? "Consultation");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dateTime = date && time ? new Date(`${date}T${time}`) : new Date();
    onSubmit({
      id: initialData?.id ?? Date.now().toString(),
      patient,
      dob,
      phone,
      email,
      address,
      date: dateTime.toISOString(),
      type,
    });
    if (!initialData) {
      setPatient(""); setDob(""); setPhone(""); setEmail(""); setAddress(""); setDate(""); setTime(""); setType("Consultation");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Nom du patient" value={patient} onChange={(e) => setPatient(e.target.value)} required className="rounded-xl border-gray-300 focus:ring-cyan-300" />
      <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="rounded-xl border-gray-300 focus:ring-cyan-300" />
      <Input type="tel" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="rounded-xl border-gray-300 focus:ring-cyan-300" />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl border-gray-300 focus:ring-cyan-300" />
      <Input placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} required className="rounded-xl border-gray-300 focus:ring-cyan-300" />
      <div className="grid grid-cols-2 gap-3">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="rounded-xl border-gray-300 focus:ring-cyan-300" />
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="rounded-xl border-gray-300 focus:ring-cyan-300" />
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as AppointmentType)}
        className="w-full rounded-xl border-gray-300 px-4 py-3 text-gray-900 focus:ring-cyan-300 focus:outline-none"
      >
        <option value="Consultation">Consultation</option>
        <option value="Suivi">Suivi</option>
        <option value="Urgence">Urgence</option>
        <option value="Bilan">Bilan</option>
      </select>
      <Button type="submit" className="w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white hover:bg-white hover:text-[#0f172a] font-bold rounded-xl shadow-lg transition">
        {initialData ? "Modifier" : "Enregistrer"}
      </Button>
    </form>
  );
}