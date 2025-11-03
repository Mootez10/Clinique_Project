"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Heart, Brain, Baby, Bone, Eye, Stethoscope, Plus, Edit, Trash2 } from "lucide-react"

export function DepartmentsManagement() {
  const departments = [
    {
      name: "Cardiology",
      icon: Heart,
      head: "Dr. Sarah Smith",
      staff: 12,
      patients: 145,
      status: "active",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      name: "Neurology",
      icon: Brain,
      head: "Dr. Michael Chen",
      staff: 8,
      patients: 98,
      status: "active",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Pediatrics",
      icon: Baby,
      head: "Dr. Emily Brown",
      staff: 15,
      patients: 203,
      status: "active",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      name: "Orthopedics",
      icon: Bone,
      head: "Dr. James Wilson",
      staff: 10,
      patients: 87,
      status: "active",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      name: "Ophthalmology",
      icon: Eye,
      head: "Dr. Lisa Garcia",
      staff: 6,
      patients: 64,
      status: "active",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      name: "Internal Medicine",
      icon: Stethoscope,
      head: "Dr. Robert Taylor",
      staff: 14,
      patients: 178,
      status: "active",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept, index) => (
          <Card key={index} className="group transition-all hover:border-primary hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`rounded-lg ${dept.bgColor} p-3 ${dept.color}`}>
                  <dept.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline">{dept.status}</Badge>
              </div>
              <CardTitle className="mt-4">{dept.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Department Head:</span>
                  <p className="font-medium text-foreground">{dept.head}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Staff</span>
                    <p className="text-lg font-semibold text-foreground">{dept.staff}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Patients</span>
                    <p className="text-lg font-semibold text-foreground">{dept.patients}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-white bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
