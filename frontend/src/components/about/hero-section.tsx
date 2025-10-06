import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Phone } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16 lg:py-32">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-6 text-balance font-sans text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Committed to Your Health and{" "}
              <span className="relative inline-block">
                Wellbeing
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
              For over 25 years, we've been providing compassionate, patient-centered care to our community. Our mission
              is to deliver exceptional healthcare services that improve lives.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-8">
              <div>
                <div className="mb-1 text-3xl font-bold text-primary-foreground">25+</div>
                <div className="text-sm text-primary-foreground/80">Years Experience</div>
              </div>
              <div>
                <div className="mb-1 text-3xl font-bold text-primary-foreground">50+</div>
                <div className="text-sm text-primary-foreground/80">Medical Experts</div>
              </div>
              <div>
                <div className="mb-1 text-3xl font-bold text-primary-foreground">100K+</div>
                <div className="text-sm text-primary-foreground/80">Happy Patients</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative h-full min-h-[500px] overflow-hidden rounded-2xl">
              <Image
                src="/professional-medical-team-in-modern-hospital-setti.jpg"
                alt="Professional medical team"
                fill
                className="object-cover"
                priority
              />
              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 rounded-xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <svg
                      className="h-6 w-6 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="mb-1 font-semibold text-foreground">Accredited Excellence</div>
                    <div className="text-sm text-muted-foreground">Certified by leading healthcare organizations</div>
                  </div>
                </div>
              </div>
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
