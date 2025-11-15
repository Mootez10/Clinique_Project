// app/equipment/page.tsx
import { EquipmentTable } from "@/components/equipment/equipment-table";
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';

export default function EquipmentPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR]}>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 py-10">
          {/* HEADER */}
          <header className="text-center mb-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Gestion des Stocks Médicaux
            </h1>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto text-lg">
              Suivi intelligent et centralisé des équipements, consommables et
              dispositifs médicaux de votre clinique.
            </p>
          </header>

          {/* TABLE SECTION */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <EquipmentTable />
          </section>

          {/* FOOTER */}
          <footer className="mt-12 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Clinique Santé — Système de gestion de
            stock médical
          </footer>
        </div>
      </main>
    </RoleGuard>
  );
}