import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Heart, Brain, Baby, Bone } from "lucide-react"

export function DepartmentOverview() {
  const departments = [
    {
      name: "Cardiology",
      icon: Heart,
      patients: 145,
      staff: 12,
      status: "active",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      name: "Neurology",
      icon: Brain,
      patients: 98,
      staff: 8,
      status: "active",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Pediatrics",
      icon: Baby,
      patients: 203,
      staff: 15,
      status: "active",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      name: "Orthopedics",
      icon: Bone,
      patients: 87,
      staff: 10,
      status: "active",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((dept, index) => (
            <div key={index} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <div className={`rounded-lg ${dept.bgColor} p-2 ${dept.color}`}>
                  <dept.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {dept.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{dept.name}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Patients:</span>
                  <span className="font-medium text-foreground">{dept.patients}</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff:</span>
                  <span className="font-medium text-foreground">{dept.staff}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
