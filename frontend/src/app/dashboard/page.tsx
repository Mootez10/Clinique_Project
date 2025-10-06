import { DashboardLayout } from "../../components/dashboard/dashboard-layout"
import { DashboardStats } from "../../components/dashboard/dashboard-stats"
import { RecentAppointments } from "../../components/dashboard/recent-appointments"
import { DepartmentOverview } from "../../components/dashboard/department-overview"
import { UserActivity } from "../../components/dashboard/user-activity"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-pretty text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        <DashboardStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentAppointments />
          <UserActivity />
        </div>

        <DepartmentOverview />
      </div>
    </DashboardLayout>
  )
}
