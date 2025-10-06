import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Stethoscope, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Total Patients",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Appointments Today",
      value: "48",
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Departments",
      value: "12",
      change: "0%",
      trend: "neutral",
      icon: Stethoscope,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Patient Satisfaction",
      value: "98.5%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${stat.bgColor} p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.trend === "up"
                    ? "text-green-600"
                    : stat.trend === "down"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
