"use client"

import { useEffect, useState } from "react"
import CalendarView from "./components/CalendarView"
import AppointmentList from "./components/AppointmentList"
import AppointmentForm from "./components/AppointmentForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { getAppointments, createAppointment, deleteAppointment } from "./data/appointments"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editAppt, setEditAppt] = useState<any | null>(null)
  const [search, setSearch] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDeleteId, setToDeleteId] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setAppointments(getAppointments())
  }, [])

  const handleAdd = (newAppt: any) => {
    if (editAppt) {
      // Modification
      const updated = appointments.map((a) => a.id === editAppt.id ? { ...editAppt, ...newAppt, id: editAppt.id } : a)
      // Remplacez cette ligne par votre logique de persistance si besoin
      localStorage.setItem("appointments", JSON.stringify(updated))
      setAppointments(updated)
      setEditAppt(null)
      toast.success("Rendez-vous modifié ✏️")
    } else {
      createAppointment(newAppt)
      setAppointments(getAppointments())
      toast.success("Rendez-vous ajouté ✅")
    }
    setOpen(false)
  }

  const handleDeleteRequest = (id: string) => {
    setToDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (toDeleteId) {
      deleteAppointment(toDeleteId)
      setAppointments(getAppointments())
      toast.error("Rendez-vous annulé ❌")
      setToDeleteId(null)
      setConfirmOpen(false)
    }
  }

  const handleDeleteCancel = () => {
    setToDeleteId(null)
    setConfirmOpen(false)
  }

  const handleEdit = (appt: any) => {
    setEditAppt(appt)
    setOpen(true)
  }

  // Filtrer les rendez-vous selon la recherche
  const filteredAppointments = appointments.filter(appt =>
    appt.patient?.toLowerCase().includes(search.toLowerCase())
  )

  const { patient, date, time, id } = editAppt || {}

  return (
    <div className={`min-h-screen w-full ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-[#f8fafc] via-[#f3f4f6] to-[#e5e7eb]"} py-0 flex items-stretch justify-center relative overflow-x-hidden`}>
      {/* Decorative SVG background */}
      <svg className={`absolute left-0 top-0 w-full h-96 opacity-30 pointer-events-none ${theme === "dark" ? "hidden" : ""}`} viewBox="0 0 1440 320">
        <path fill="#232946" fillOpacity="0.15" d="M0,160L60,154.7C120,149,240,139,360,154.7C480,171,600,213,720,197.3C840,181,960,107,1080,101.3C1200,96,1320,160,1380,192L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
      </svg>
      <div className="w-full max-w-7xl px-0 flex flex-col z-10">
        {/* Hero Section */}
        <section className={`relative w-full ${theme === "dark" ? "bg-gradient-to-r from-gray-900/90 to-gray-800/90" : "bg-gradient-to-r from-[#e5e7eb]/90 to-[#f3f4f6]/90"} py-12 px-6 rounded-b-3xl shadow-lg mb-10 overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-8`}>
          <div className="flex items-center gap-6">
            <img
              src="/clinic.jpg"
              alt="Clinique"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl hover:scale-105 transition-transform duration-300 ring-4 ring-gray-200"
            />
            <div>
              <h1 className={`text-4xl md:text-5xl font-black flex items-center gap-3 tracking-tight drop-shadow-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                <span className="text-5xl">📅</span> Agenda & Rendez-vous
              </h1>
              <p className={`mt-3 text-lg font-medium max-w-xl ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                Gérez vos rendez-vous professionnels avec efficacité et visualisez-les sur un calendrier interactif.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Basculer le thème"
              className="rounded-full p-2 border border-gray-200 bg-white/80 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
            >
              {theme === "dark" ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-900" />}
            </button>
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditAppt(null) }}>
              <DialogTrigger asChild>
                <Button
                  className={`bg-gradient-to-r ${theme === "dark"
                    ? "from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900"
                    : "from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-300"
                  } transition-all duration-200 shadow-xl text-gray-900 dark:text-white font-bold px-8 py-3 rounded-xl text-lg focus:ring-4 focus:ring-gray-300 focus:outline-none animate-bounce-slow`}
                  size="lg"
                  onClick={() => { setEditAppt(null); setOpen(true); }}
                >
                  + Nouveau rendez-vous
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editAppt ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}</DialogTitle>
                </DialogHeader>
                <AppointmentForm onSubmit={handleAdd} initialData={editAppt} />
              </DialogContent>
            </Dialog>
          </div>
        </section>
        {/* Main Content */}
        <main className="flex-1 w-full px-2 md:px-0">
          <Card className={`w-full shadow-2xl p-10 rounded-3xl border ${theme === "dark" ? "border-gray-800 bg-gray-900/95" : "border-gray-200 bg-white/95"} animate-fade-in`}>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="transition-transform duration-300 hover:scale-[1.02]">
                <CalendarView appointments={filteredAppointments} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className={`text-2xl font-bold border-b pb-3 flex items-center gap-2 ${theme === "dark" ? "text-gray-100 border-gray-700" : "text-gray-900 border-gray-200"}`}>
                    <span className="text-xl">📋</span> Tous les rendez-vous
                  </h2>
                  <Input
                    type="text"
                    placeholder="Rechercher un patient..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="ml-auto w-56 rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className={`divide-y rounded-xl overflow-hidden shadow-sm ${theme === "dark" ? "divide-gray-800 bg-gray-800/40" : "divide-gray-100 bg-gray-100/40"}`}>
                  <AppointmentList
                    appointments={filteredAppointments}
                    onDelete={handleDeleteRequest}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
      {/* Confirmation Dialog */}
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Confirmer la suppression</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div className="py-4">
            Voulez-vous vraiment supprimer ce rendez-vous ?
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDeleteCancel}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Supprimer
            </Button>
          </div>
        </ConfirmDialogContent>
      </ConfirmDialog>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
      `}</style>
    </div>
  )
}
