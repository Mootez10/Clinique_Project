// app/agenda/components/AppointmentList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

type AppointmentType = "Consultation" | "Suivi" | "Urgence" | "Bilan";

interface Appointment {
  id: string;
  patient: string;
  date: string;
  type: AppointmentType;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
  onEdit: (appt: Appointment) => void;
}

export default function AppointmentList({ appointments, onDelete, onEdit }: AppointmentListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Liste des rendez-vous</h2>
      {appointments.length === 0 && (
        <p className="text-center text-gray-500 italic py-8">Aucun rendez-vous trouvé.</p>
      )}
      <AnimatePresence>
        {appointments.map((appt) => (
          <motion.div
            key={appt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{appt.patient}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(appt.date).toLocaleDateString("fr-FR")} — {new Date(appt.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white">
                {appt.type}
              </Badge>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => onEdit(appt)}>Modifier</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(appt.id)}>Annuler</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}