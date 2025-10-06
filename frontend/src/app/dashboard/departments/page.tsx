import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DepartmentsManagement } from "@/components/dashboard/departments-management"

export default function DepartmentsManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Departments Management</h1>
          <p className="text-pretty text-muted-foreground">Manage medical departments, staff, and resources.</p>
        </div>

        <DepartmentsManagement />
      </div>
    </DashboardLayout>
  )
}
