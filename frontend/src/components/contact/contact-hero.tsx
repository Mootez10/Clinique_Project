import { Mail, Phone, MapPin } from "lucide-react"

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-slate-900 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-balance font-sans text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
            Have questions or need to schedule an appointment? We're here to help. Reach out to us through any of the
            channels below.
          </p>

          {/* Quick Contact Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="group rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all hover:bg-primary-foreground/20">
              <Phone className="mx-auto mb-3 h-8 w-8 text-primary-foreground" />
              <p className="text-sm font-medium text-primary-foreground/80">Call Us</p>
              <p className="mt-1 text-lg font-semibold text-primary-foreground">(555) 123-4567</p>
            </div>
            <div className="group rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all hover:bg-primary-foreground/20">
              <Mail className="mx-auto mb-3 h-8 w-8 text-primary-foreground" />
              <p className="text-sm font-medium text-primary-foreground/80">Email Us</p>
              <p className="mt-1 text-lg font-semibold text-primary-foreground">info@healthcare.com</p>
            </div>
            <div className="group rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all hover:bg-primary-foreground/20">
              <MapPin className="mx-auto mb-3 h-8 w-8 text-primary-foreground" />
              <p className="text-sm font-medium text-primary-foreground/80">Visit Us</p>
              <p className="mt-1 text-lg font-semibold text-primary-foreground">123 Medical Center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>
    </section>
  )
}
