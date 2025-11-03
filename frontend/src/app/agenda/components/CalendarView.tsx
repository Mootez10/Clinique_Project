"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

export default function CalendarView({ appointments }: { appointments: any[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { theme } = useTheme()

  const filteredAppointments = appointments.filter(
    (appt) =>
      date &&
      new Date(appt.date).toDateString() === date.toDateString()
  )

  return (
    <div className="p-0 md:p-6">
      <Card className={`shadow-2xl rounded-3xl border-0 relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-100 via-white to-indigo-100"
      }`}>
        {/* Decorative circle */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40 blur-2xl pointer-events-none ${
          theme === "dark" ? "bg-gray-700" : "bg-indigo-100"
        }`} />
        <div className={`sticky top-0 z-10 backdrop-blur-md rounded-xl mb-4 px-2 py-2 flex items-center gap-2 border-b ${
          theme === "dark" ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-blue-100"
        }`}>
          <h2 className={`text-2xl font-extrabold flex items-center gap-2 tracking-tight ${
            theme === "dark" ? "text-gray-100" : "text-blue-900"
          }`}>
            <span className="text-3xl">🗓️</span> Calendrier
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-shrink-0 flex flex-col items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className={`rounded-2xl border-2 shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-900 text-gray-100"
                  : "border-blue-200 bg-white"
              }`}
            />
            <div className={`mt-4 text-xs italic animate-pulse ${
              theme === "dark" ? "text-gray-400" : "text-blue-500"
            }`}>
              Cliquez sur une date pour voir les rendez-vous
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-[180px]">
            <h3 className={`font-semibold mb-4 text-lg flex items-center gap-2 ${
              theme === "dark" ? "text-gray-200" : "text-blue-800"
            }`}>
              <span className="text-base">📆</span>
              Rendez-vous du {date?.toLocaleDateString("fr-FR")}
            </h3>
            {filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <svg width="48" height="48" fill="none" className="mb-2 opacity-60" viewBox="0 0 24 24">
                  <path d="M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-muted-foreground italic text-center">Aucun rendez-vous ce jour.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {filteredAppointments.map((appt, i) => (
                  <li
                    key={i}
                    className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 rounded-xl px-3 md:px-4 py-3 shadow-md hover:scale-[1.01] transition-all duration-200 group min-h-[64px] ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-gray-800/60 to-gray-900/60 hover:bg-gray-800/80"
                        : "bg-gradient-to-r from-blue-200/60 to-indigo-100/60 hover:bg-indigo-50/80"
                    }`}
                  >
                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`font-bold px-3 py-1 rounded-lg shadow group-hover:from-indigo-500 group-hover:to-blue-400 transition ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100"
                            : "bg-gradient-to-r from-blue-500 to-indigo-400 text-white"
                        }`}
                      >
                        {appt.type}
                      </Badge>
                      <span className={theme === "dark" ? "font-medium text-gray-100" : "font-medium text-blue-900"}>{appt.patient}</span>
                      {appt.dob && (
                        <span className={`text-xs font-mono md:ml-2 ${theme === "dark" ? "text-gray-400" : "text-blue-500"}`}>
                          🎂 {new Date(appt.dob).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                      {appt.phone && (
                        <span className={`text-xs font-mono md:ml-2 ${theme === "dark" ? "text-gray-400" : "text-blue-500"}`}>
                          📞 {appt.phone}
                        </span>
                      )}
                      {appt.address && (
                        <span className={`text-xs font-mono md:ml-2 truncate max-w-[180px] ${theme === "dark" ? "text-gray-400" : "text-blue-500"}`}>
                          📍 {appt.address}
                        </span>
                      )}
                      <span className={`text-xs font-mono md:ml-2 ${theme === "dark" ? "text-gray-300" : "text-blue-700"}`}>
                        {new Date(appt.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
