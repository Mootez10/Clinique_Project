import { MapPin } from "lucide-react"

export function MapSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Find Us</h2>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground">
            Located in the heart of Healthcare City with easy access and ample parking
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
            {/* Map placeholder - Replace with actual map integration */}
            <div className="relative aspect-[16/9] bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-foreground">Interactive Map</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    123 Medical Center Drive, Suite 100
                    <br />
                    Healthcare City, HC 12345
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Integrate with Google Maps, Mapbox, or your preferred map provider
                  </p>
                </div>
              </div>
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>
          </div>

          {/* Directions info */}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <h3 className="mb-2 font-semibold text-foreground">By Car</h3>
              <p className="text-sm text-muted-foreground">Free parking available on-site with easy highway access</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <h3 className="mb-2 font-semibold text-foreground">Public Transit</h3>
              <p className="text-sm text-muted-foreground">Bus routes 12, 45, and 78 stop directly in front</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <h3 className="mb-2 font-semibold text-foreground">Accessibility</h3>
              <p className="text-sm text-muted-foreground">Wheelchair accessible with elevator access to all floors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
