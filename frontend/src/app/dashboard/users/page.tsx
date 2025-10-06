import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UsersTable } from "@/components/dashboard/users-table"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-pretty text-muted-foreground">Manage patients, doctors, and staff accounts.</p>
        </div>

        <UsersTable />
      </div>
    </DashboardLayout>
  )
}
