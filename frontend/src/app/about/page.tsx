import { HeroSection } from "@/components/about/hero-section"
import { MissionSection } from "@/components/about/mission-section"
import { ValuesSection } from "@/components/about/values-section"
import { TeamSection } from "@/components/about/team-section"
import { StatsSection } from "@/components/about/stats-section"
import { CtaSection } from "@/components/about/cta-section"
import { Navbar } from "@/components/layout/Navbar"


export default function AboutPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen">
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <StatsSection />
      <TeamSection />
      <CtaSection />
    </main>
    </>
  )
}
