import { Clock, Shield, Award, HeartPulse } from "lucide-react"

export function FeaturedServices() {
  const features = [
    {
      icon: Clock,
      title: "24/7 Emergency Care",
      description: "Round-the-clock emergency services with rapid response teams ready to handle any medical crisis.",
    },
    {
      icon: Shield,
      title: "Advanced Technology",
      description:
        "State-of-the-art medical equipment and cutting-edge treatment methods for optimal patient outcomes.",
    },
    {
      icon: Award,
      title: "Board-Certified Specialists",
      description: "Highly qualified medical professionals with extensive training and years of experience.",
    },
    {
      icon: HeartPulse,
      title: "Patient-Centered Approach",
      description: "Personalized care plans tailored to each patient's unique needs and health goals.",
    },
  ]

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why Choose Our Departments
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Every department is committed to delivering exceptional care with the highest standards of medical
            excellence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-balance font-sans text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
