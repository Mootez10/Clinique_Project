import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Clock } from "lucide-react"

export function RecentAppointments() {
  const appointments = [
    {
      patient: "Sarah Johnson",
      doctor: "Dr. Smith",
      time: "09:00 AM",
      department: "Cardiology",
      status: "confirmed",
      avatar: "/patient-female.jpg",
    },
    {
      patient: "Michael Chen",
      doctor: "Dr. Williams",
      time: "10:30 AM",
      department: "Neurology",
      status: "pending",
      avatar: "/patient-male.jpg",
    },
    {
      patient: "Emma Davis",
      doctor: "Dr. Brown",
      time: "11:00 AM",
      department: "Pediatrics",
      status: "confirmed",
      avatar: "/patient-child.jpg",
    },
    {
      patient: "James Wilson",
      doctor: "Dr. Garcia",
      time: "02:00 PM",
      department: "Orthopedics",
      status: "in-progress",
      avatar: "/patient-senior.jpg",
    },
  ]

  const statusColors = {
    confirmed: "bg-green-500/10 text-green-700 dark:text-green-400",
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
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
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {appointment.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
