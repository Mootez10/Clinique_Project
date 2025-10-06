import { Heart, Users, Award } from "lucide-react"

export function MissionSection() {
  const missions = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description:
        "We put our patients first, ensuring every individual receives personalized attention and treatment tailored to their unique needs.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "As a cornerstone of our community, we are dedicated to improving public health through education, prevention, and accessible care.",
    },
    {
      icon: Award,
      title: "Excellence in Medicine",
      description:
        "Our team of board-certified physicians and specialists are committed to staying at the forefront of medical innovation and best practices.",
    },
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Mission
          </h2>
          <p className="mb-16 text-pretty text-lg leading-relaxed text-muted-foreground">
            To provide comprehensive, compassionate healthcare that empowers our patients to live healthier, happier
            lives.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <mission.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-balance font-sans text-xl font-semibold text-card-foreground">
                {mission.title}
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">{mission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
