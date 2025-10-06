import { Shield, Lightbulb, Handshake, Target } from "lucide-react"

export function ValuesSection() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We uphold the highest ethical standards in all our interactions and medical practices.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace cutting-edge technology and research to provide the best possible care.",
    },
    {
      icon: Handshake,
      title: "Compassion",
      description: "We treat every patient with empathy, respect, and understanding.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest quality in every aspect of patient care and service.",
    },
  ]

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Core Values
          </h2>
          <p className="mb-16 text-pretty text-lg leading-relaxed text-muted-foreground">
            These principles guide everything we do and shape the care we provide to our patients every day.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div key={index} className="rounded-xl bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-4 text-primary">
                <value.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-balance font-sans text-lg font-semibold text-card-foreground">{value.title}</h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
