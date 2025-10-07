"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export default function AppointmentList({
  appointments,
  onDelete,
  onEdit,
}: {
  appointments: any[],
  onDelete: (id: string) => void,
  onEdit: (appt: any) => void
}) {
  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border-0">
      <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">📋</span> Liste des rendez-vous
      </h2>
      {appointments.length === 0 && (
        <div className="flex flex-col items-center py-8 opacity-70">
          <svg width="48" height="48" fill="none" className="mb-2" viewBox="0 0 24 24">
            <path d="M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-muted-foreground italic">Aucun rendez-vous pour le moment.</p>
        </div>
      )}
      <ul className="flex flex-col gap-3">
        <AnimatePresence>
          {appointments.map((appt) => (
            <motion.li
              key={appt.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-gradient-to-r from-blue-200/60 to-indigo-100/60 rounded-xl px-3 md:px-4 py-3 shadow-md hover:scale-[1.01] hover:bg-indigo-50/80 transition-all duration-200 group"
            >
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="font-semibold text-blue-900 text-base md:text-lg">{appt.patient}</span>
                <span className="text-xs text-blue-700 font-mono md:ml-2">
                  {new Date(appt.date).toLocaleDateString("fr-FR")} — {new Date(appt.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <Badge
                  variant="outline"
                  className="mt-1 md:mt-0 w-fit bg-gradient-to-r from-blue-500 to-indigo-400 text-white font-bold px-3 py-1 rounded-lg shadow group-hover:from-indigo-500 group-hover:to-blue-400 transition"
                >
                  {appt.type}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow hover:scale-105 transition-transform"
                  onClick={() => onEdit(appt)}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="shadow hover:scale-105 transition-transform"
                  onClick={() => onDelete(appt.id)}
                >
                  Annuler
                </Button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  )
}
