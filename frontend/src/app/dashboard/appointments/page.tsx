import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AppointmentsCalendar } from "@/components/dashboard/appointments-calendar"

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Appointments</h1>
          <p className="text-pretty text-muted-foreground">View and manage all patient appointments.</p>
        </div>

        <AppointmentsCalendar />
      </div>
    </DashboardLayout>
  )
}
