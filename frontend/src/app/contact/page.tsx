import { Navbar } from "@/components/layout/Navbar"
import { ContactHero } from "../../components/contact/contact-hero"
import { ContactForm } from "../../components/contact/contact-form"
import { ContactInfo } from "../../components/contact/contact-info"
import { QuickContact } from "../../components/contact/quick-contact"
import { MapSection } from "../../components/contact/map-section"

export default function ContactPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen">
      <ContactHero />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
      <QuickContact />
      <MapSection />
    </main>
    </>
  )
}
