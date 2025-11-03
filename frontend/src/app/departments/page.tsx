import { Navbar } from "@/components/layout/Navbar"
import { DepartmentsHero } from "../../components/departments/departments-hero"
import { DepartmentsGrid } from "../../components/departments/departments-grid"
import { FeaturedServices } from "../../components/departments/featured-services"
import { DepartmentsCta } from "../../components/departments/departments-cta"

export default function DepartmentsPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen">
      <DepartmentsHero />
      <DepartmentsGrid />
      <FeaturedServices />
      <DepartmentsCta />
    </main>
    </>
  )
}
