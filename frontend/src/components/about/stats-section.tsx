export function StatsSection() {
  const stats = [
    { value: "25+", label: "Years of Service" },
    { value: "50+", label: "Medical Professionals" },
    { value: "100K+", label: "Patients Served" },
    { value: "15+", label: "Specialties Offered" },
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
              <div className="text-pretty text-base text-muted-foreground md:text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
