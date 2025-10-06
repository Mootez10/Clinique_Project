import { Card, CardContent } from "@/components/ui/card"

export function TeamSection() {
  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine",
      image: "/professional-female-doctor.png",
    },
    {
      name: "Dr. James Chen",
      role: "Director of Cardiology",
      specialty: "Cardiovascular Medicine",
      image: "/male-cardiologist.png",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Head of Pediatrics",
      specialty: "Pediatric Care",
      image: "/professional-female-pediatrician.png",
    },
    {
      name: "Dr. Michael Thompson",
      role: "Chief of Surgery",
      specialty: "General Surgery",
      image: "/professional-male-surgeon.jpg",
    },
  ]

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Meet Our Leadership Team
          </h2>
          <p className="mb-16 text-pretty text-lg leading-relaxed text-muted-foreground">
            Our experienced medical professionals are dedicated to providing you with the highest quality care.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-1 text-balance font-sans text-lg font-semibold text-card-foreground">
                  {member.name}
                </h3>
                <p className="mb-1 text-pretty text-sm font-medium text-primary">{member.role}</p>
                <p className="text-pretty text-sm text-muted-foreground">{member.specialty}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
