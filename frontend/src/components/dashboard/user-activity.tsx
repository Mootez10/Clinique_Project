import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

export function UserActivity() {
  const activities = [
    {
      user: "Dr. Smith",
      action: "Updated patient record",
      time: "5 minutes ago",
      avatar: "/doctor-male.jpg",
    },
    {
      user: "Nurse Johnson",
      action: "Scheduled new appointment",
      time: "15 minutes ago",
      avatar: "/nurse-female.jpg",
    },
    {
      user: "Dr. Williams",
      action: "Completed consultation",
      time: "1 hour ago",
      avatar: "/doctor-female.jpg",
    },
    {
      user: "Admin",
      action: "Added new department",
      time: "2 hours ago",
      avatar: "/admin-interface.png",
    },
    {
      user: "Dr. Brown",
      action: "Approved prescription",
      time: "3 hours ago",
      avatar: "/doctor-senior.jpg",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-foreground">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
 