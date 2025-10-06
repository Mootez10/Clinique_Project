import { Clock, Mail, MapPin, Phone } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6 text-3xl font-bold text-foreground">Contact Information</h2>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          Our dedicated team is available to assist you with appointments, inquiries, and any healthcare needs you may
          have.
        </p>
      </div>

      <div className="space-y-6">
        {/* Phone */}
        <div className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Phone</h3>
            <p className="text-sm text-muted-foreground">Call us for immediate assistance</p>
            <p className="mt-2 font-medium text-foreground">Main: (555) 123-4567</p>
            <p className="font-medium text-foreground">Emergency: (555) 123-4568</p>
          </div>
        </div>

        {/* Email */}
        <div className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Email</h3>
            <p className="text-sm text-muted-foreground">Send us an email anytime</p>
            <p className="mt-2 font-medium text-foreground">info@healthcare.com</p>
            <p className="font-medium text-foreground">appointments@healthcare.com</p>
          </div>
        </div>

        {/* Address */}
        <div className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Address</h3>
            <p className="text-sm text-muted-foreground">Visit us at our main location</p>
            <p className="mt-2 font-medium text-foreground">123 Medical Center Drive</p>
            <p className="font-medium text-foreground">Suite 100, Healthcare City, HC 12345</p>
          </div>
        </div>

        {/* Hours */}
        <div className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Office Hours</h3>
            <p className="text-sm text-muted-foreground">We're here when you need us</p>
            <div className="mt-2 space-y-1">
              <p className="font-medium text-foreground">Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p className="font-medium text-foreground">Saturday: 9:00 AM - 2:00 PM</p>
              <p className="font-medium text-foreground">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
