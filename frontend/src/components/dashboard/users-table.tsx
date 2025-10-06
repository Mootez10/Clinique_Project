"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Search, MoreVertical, UserPlus, Edit, Trash2 } from "lucide-react"

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const users = [
    {
      name: "Dr. Sarah Smith",
      email: "sarah.smith@medicare.com",
      role: "Doctor",
      department: "Cardiology",
      status: "active",
      avatar: "/doctor-female.jpg",
    },
    {
      name: "John Doe",
      email: "john.doe@email.com",
      role: "Patient",
      department: "-",
      status: "active",
      avatar: "/patient-male.jpg",
    },
    {
      name: "Nurse Emily Johnson",
      email: "emily.j@medicare.com",
      role: "Nurse",
      department: "Pediatrics",
      status: "active",
      avatar: "/nurse-female.jpg",
    },
    {
      name: "Dr. Michael Chen",
      email: "m.chen@medicare.com",
      role: "Doctor",
      department: "Neurology",
      status: "active",
      avatar: "/doctor-male.jpg",
    },
    {
      name: "Admin User",
      email: "admin@medicare.com",
      role: "Admin",
      department: "Administration",
      status: "active",
      avatar: "/admin-interface.png",
    },
  ]

  const roleColors = {
    Doctor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Patient: "bg-green-500/10 text-green-700 dark:text-green-400",
    Nurse: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    Admin: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Users</CardTitle>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={roleColors[user.role as keyof typeof roleColors]}>{user.role}</Badge>
                <span className="hidden text-sm text-muted-foreground sm:block">{user.department}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
