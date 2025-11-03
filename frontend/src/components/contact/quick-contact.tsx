import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, Phone } from "lucide-react"

export function QuickContact() {
  return (
    <section className="border-y border-border bg-muted/30 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Need Immediate Assistance?</h2>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground">
            Choose the best way to reach us based on your needs
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Book Appointment</h3>
              <p className="mb-4 text-sm text-muted-foreground">Schedule your visit online at your convenience</p>
              <Button className="w-full bg-transparent" variant="outline">
                Schedule Now
              </Button>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Phone className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Call Us</h3>
              <p className="mb-4 text-sm text-muted-foreground">Speak directly with our staff for urgent matters</p>
              <Button className="w-full bg-transparent" variant="outline">
                (555) 123-4567
              </Button>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Live Chat</h3>
              <p className="mb-4 text-sm text-muted-foreground">Chat with our support team in real-time</p>
              <Button className="w-full bg-transparent" variant="outline">
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
