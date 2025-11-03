import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Brain,
  Baby,
  Bone,
  Eye,
  Stethoscope,
  Activity,
  Pill,
  Users,
  Scissors,
  Microscope,
  Syringe,
} from "lucide-react"

export function DepartmentsGrid() {
  const departments = [
    {
      icon: Heart,
      name: "Cardiology",
      description: "Comprehensive heart and cardiovascular care with advanced diagnostic and treatment options.",
      services: ["ECG", "Echocardiography", "Cardiac Catheterization"],
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Brain,
      name: "Neurology",
      description: "Expert care for brain, spine, and nervous system disorders with cutting-edge treatments.",
      services: ["MRI Scans", "EEG Testing", "Stroke Care"],
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Baby,
      name: "Pediatrics",
      description: "Specialized healthcare for infants, children, and adolescents in a caring environment.",
      services: ["Well-Child Visits", "Vaccinations", "Growth Monitoring"],
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Bone,
      name: "Orthopedics",
      description: "Treatment for bone, joint, and muscle conditions with surgical and non-surgical options.",
      services: ["Joint Replacement", "Sports Medicine", "Fracture Care"],
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Eye,
      name: "Ophthalmology",
      description: "Complete eye care services from routine exams to advanced surgical procedures.",
      services: ["Cataract Surgery", "LASIK", "Glaucoma Treatment"],
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Stethoscope,
      name: "Internal Medicine",
      description: "Primary care and management of complex medical conditions for adults.",
      services: ["Annual Physicals", "Chronic Disease Management", "Preventive Care"],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Activity,
      name: "Emergency Medicine",
      description: "24/7 emergency care with rapid response teams and advanced life support.",
      services: ["Trauma Care", "Critical Care", "Emergency Surgery"],
      color: "text-red-600",
      bgColor: "bg-red-600/10",
    },
    {
      icon: Pill,
      name: "Oncology",
      description: "Comprehensive cancer care with personalized treatment plans and support services.",
      services: ["Chemotherapy", "Radiation Therapy", "Immunotherapy"],
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      icon: Users,
      name: "Family Medicine",
      description: "Holistic healthcare for patients of all ages with a focus on preventive care.",
      services: ["Family Planning", "Health Screenings", "Chronic Care"],
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Scissors,
      name: "General Surgery",
      description: "Advanced surgical procedures with minimally invasive techniques when possible.",
      services: ["Laparoscopic Surgery", "Hernia Repair", "Appendectomy"],
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
    },
    {
      icon: Microscope,
      name: "Pathology",
      description: "Accurate diagnostic testing and laboratory services for precise medical decisions.",
      services: ["Blood Tests", "Biopsies", "Tissue Analysis"],
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      icon: Syringe,
      name: "Radiology",
      description: "State-of-the-art imaging services for accurate diagnosis and treatment planning.",
      services: ["X-Ray", "CT Scan", "MRI"],
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Medical Departments
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Explore our comprehensive range of medical specialties, each staffed with experienced professionals and
            equipped with the latest technology.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept, index) => (
            <Card key={index} className="group overflow-hidden transition-all hover:border-primary hover:shadow-lg">
              <CardContent className="p-6">
                <div className={`mb-4 inline-flex rounded-lg ${dept.bgColor} p-3 ${dept.color}`}>
                  <dept.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-balance font-sans text-xl font-semibold text-card-foreground">{dept.name}</h3>
                <p className="mb-4 text-pretty text-sm leading-relaxed text-muted-foreground">{dept.description}</p>

                <div className="mb-4 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">Key Services:</div>
                  <ul className="space-y-1">
                    {dept.services.map((service, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className={`h-1 w-1 rounded-full ${dept.color}`} />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground bg-transparent"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
