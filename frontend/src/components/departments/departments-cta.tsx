import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Calendar } from "lucide-react"

export function DepartmentsCta() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl bg-slate-900 px-8 py-16 text-center md:px-12 md:py-20">
          <h2 className="mb-4 text-balance font-sans text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Need to See a Specialist?
          </h2>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-primary-foreground/90">
            Our expert medical teams are here to help. Schedule an appointment with the right department for your needs.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Us: (555) 123-4567
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 border-t border-primary-foreground/20 pt-8 text-left sm:grid-cols-3">
            <div>
              <div className="mb-1 text-sm font-medium text-primary-foreground/80">Walk-in Hours</div>
              <div className="text-primary-foreground">Mon-Fri: 8AM - 8PM</div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-primary-foreground/80">Emergency</div>
              <div className="text-primary-foreground">24/7 Available</div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-primary-foreground/80">Location</div>
              <div className="text-primary-foreground">123 Medical Center Dr</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
