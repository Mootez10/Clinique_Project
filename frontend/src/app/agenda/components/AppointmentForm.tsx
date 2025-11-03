"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function AppointmentForm({
  onSubmit,
  initialData
}: {
  onSubmit: (appt: any) => void,
  initialData?: any
}) {
  const [patient, setPatient] = useState(initialData?.patient || "")
  const [dob, setDob] = useState(initialData?.dob || "")
  const [phone, setPhone] = useState(initialData?.phone || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [address, setAddress] = useState(initialData?.address || "")
  const [date, setDate] = useState(initialData?.date ? initialData.date.slice(0,10) : "")
  const [time, setTime] = useState(initialData?.date ? new Date(initialData.date).toISOString().slice(11,16) : "")
  const [type, setType] = useState(initialData?.type || "Consultation")

  useEffect(() => {
    if (initialData) {
      setPatient(initialData.patient || "")
      setDob(initialData.dob || "")
      setPhone(initialData.phone || "")
      setEmail(initialData.email || "")
      setAddress(initialData.address || "")
      setDate(initialData.date ? initialData.date.slice(0,10) : "")
      setTime(initialData.date ? new Date(initialData.date).toISOString().slice(11,16) : "")
      setType(initialData.type || "Consultation")
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dateTime = date && time ? new Date(`${date}T${time}`) : new Date(date)
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      patient,
      dob,
      phone,
      email,
      address,
      date: dateTime.toISOString(),
      type
    })
    setPatient("")
    setDob("")
    setPhone("")
    setEmail("")
    setAddress("")
    setDate("")
    setTime("")
    setType("Consultation")
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border-0">
      <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">📝</span> Nouveau rendez-vous
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Nom du patient"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          required
          className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
        <Input
          type="date"
          placeholder="Date de naissance"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
        <Input
          type="tel"
          placeholder="Numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
        <Input
          type="email"
          placeholder="Email du patient"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
        <Input
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border-blue-200 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-blue-900 bg-white"
        >
          <option value="Consultation">Consultation</option>
          <option value="Suivi">Suivi</option>
          <option value="Urgence">Urgence</option>
          <option value="Bilan">Bilan</option>
        </select>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg text-white font-semibold rounded-lg"
        >
          {initialData ? "Modifier" : "Enregistrer"}
        </Button>
      </form>
    </Card>
  )
}
