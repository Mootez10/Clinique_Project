"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="p-10 grid gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>🏠 Patient Home</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Welcome to your portal.</p>
          <p className="text-sm text-gray-500">Here you will see your appointments, prescriptions, and invoices.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-600">
            <li>📅 Book Appointment</li>
            <li>📄 Download Prescription</li>
            <li>💳 View Invoices</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
