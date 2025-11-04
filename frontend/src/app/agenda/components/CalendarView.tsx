// app/agenda/components/CalendarView.tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export default function CalendarView({ appointments }: { appointments: any[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const filtered = appointments.filter(
    (appt) => date && new Date(appt.date).toDateString() === date.toDateString()
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Calendrier</h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-xl border-gray-200 dark:border-gray-700"
      />
      <div className="mt-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          RDV du {date?.toLocaleDateString("fr-FR")}
        </h3>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucun rendez-vous</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((appt, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Badge className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white">
                  {new Date(appt.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </Badge>
                <span className="text-gray-700 dark:text-gray-300">{appt.patient}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}