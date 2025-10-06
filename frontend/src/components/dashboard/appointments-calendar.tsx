"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Calendar, Clock, Plus, Filter } from "lucide-react"

export function AppointmentsCalendar() {
  const appointments = [
    {
      time: "09:00 AM",
      patient: "Sarah Johnson",
      doctor: "Dr. Smith",
      department: "Cardiology",
      type: "Consultation",
      status: "confirmed",
      avatar: "/patient-female.jpg",
    },
    {
      time: "09:30 AM",
      patient: "Michael Chen",
      doctor: "Dr. Williams",
      department: "Neurology",
      type: "Follow-up",
      status: "pending",
      avatar: "/patient-male.jpg",
    },
    {
      time: "10:00 AM",
      patient: "Emma Davis",
      doctor: "Dr. Brown",
      department: "Pediatrics",
      type: "Check-up",
      status: "confirmed",
      avatar: "/patient-child.jpg",
    },
    {
      time: "10:30 AM",
      patient: "James Wilson",
      doctor: "Dr. Garcia",
      department: "Orthopedics",
      type: "Surgery",
      status: "in-progress",
      avatar: "/patient-senior.jpg",
    },
    {
      time: "11:00 AM",
      patient: "Lisa Anderson",
      doctor: "Dr. Taylor",
      department: "Internal Medicine",
      type: "Consultation",
      status: "confirmed",
      avatar: "/patient-female-2.jpg",
    },
  ]

  const statusColors = {
    confirmed: "bg-green-500/10 text-green-700 dark:text-green-400",
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Today's Schedule</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointments Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {appointment.time}
                </div>
                <div className="h-12 w-px bg-border" />
                <Avatar>
                  <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patient} />
                  <AvatarFallback>
                    {appointment.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{appointment.patient}</p>
                    <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{appointment.doctor}</span>
                    <span>•</span>
                    <span>{appointment.department}</span>
                    <span>•</span>
                    <span>{appointment.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
