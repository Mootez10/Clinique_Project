import { Button } from "@/components/ui/button"
import { Search, Calendar } from "lucide-react"
import Image from "next/image"

export function DepartmentsHero() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16 lg:py-32">
          {/* Left Content */}
          <div className="flex flex-col justify-center">

            <h1 className="mb-6 text-balance font-sans text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Comprehensive Care Across All{" "}
              <span className="relative inline-block">
                Specialties
                <svg
                  className="absolute -bottom-2 left-0 w-full text-primary-foreground/30"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10C50 2 150 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
              From primary care to specialized treatments, our expert medical teams are equipped with state-of-the-art
              facilities to provide you with exceptional healthcare services.
            </p>

            {/* Search Bar */}
            <div className="mb-6 flex gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-2 backdrop-blur-sm">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-primary-foreground/60" />
                <input
                  type="text"
                  placeholder="Search departments or services..."
                  className="w-full bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none"
                />
              </div>
              <Button size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Search
              </Button>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-8">
              <div>
                <div className="mb-1 text-3xl font-bold text-primary-foreground">15+</div>
                <div className="text-sm text-primary-foreground/80">Departments</div>
              </div>
              <div>
                <div className="mb-1 text-3xl font-bold text-primary-foreground">50+</div>
                <div className="text-sm text-primary-foreground/80">Specialists</div>
              </div>
              <div>
                <div className="mb-1 text-3xl font-bold text-primary-foreground">24/7</div>
                <div className="text-sm text-primary-foreground/80">Emergency Care</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative h-full min-h-[500px] overflow-hidden rounded-2xl">
              <Image
                src="/modern-hospital-corridor-with-medical-equipment.jpg"
                alt="Modern hospital facilities"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary-foreground/10 blur-3xl" />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                             linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </section>
  )
}
