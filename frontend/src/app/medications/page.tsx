// app/medications/page.tsx
'use client';

import { MedicationsDashboard } from '@/components/medications/medications-dashboard';
import { MedicationsTable } from '@/components/medications/medications-table';
import { medicationsApi } from '@/lib/api/medications';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Pill, Syringe, Heart, Thermometer } from 'lucide-react';
import { Medication } from '@/types/medication';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import { useState, useEffect, useCallback } from 'react';

// Fonction pour calculer la valeur totale réelle du stock
function calculateRealTimeStats(medications: Medication[]) {
  const totalValue = medications.reduce((sum, med) => {
    return sum + (med.price * med.quantity);
  }, 0);

  const now = new Date();
  const soon = new Date(now);
  soon.setDate(soon.getDate() + 30);

  const lowStock = medications.filter(m => m.quantity <= m.minStock && m.quantity > 0);
  const outOfStock = medications.filter(m => m.quantity === 0);
  const expiringSoon = medications.filter(m => {
    const exp = new Date(m.expirationDate);
    return exp <= soon && exp >= now && m.quantity > 0;
  });

  return {
    total: medications.length,
    lowStock: lowStock.length,
    outOfStock: outOfStock.length,
    expiringSoon: expiringSoon.length,
    totalValue,
    formattedTotalValue: new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(totalValue),
    categoriesCount: new Set(medications.map(m => m.category)).size,
    criticalItems: lowStock.length + outOfStock.length,
  };
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMedications = useCallback(async () => {
    try {
      setLoading(true);
      const meds = await medicationsApi.getAll();
      setMedications(meds);
      
      // Calcul des stats en temps réel basé sur les données actuelles
      const calculatedStats = calculateRealTimeStats(meds);
      setStats(calculatedStats);

    } catch (err: any) {
      console.error('Erreur chargement médicaments:', err);
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour rafraîchir les données après une modification
  const refreshData = useCallback(async () => {
    await loadMedications();
  }, [loadMedications]);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <MedicationsContent 
        medications={medications} 
        stats={stats} 
        error={error} 
        onRetry={loadMedications}
        onDataChange={refreshData}
      />
    </RoleGuard>
  );
}

// Composant séparé pour le contenu de la page
function MedicationsContent({ 
  medications, 
  stats, 
  error, 
  onRetry,
  onDataChange
}: { 
  medications: Medication[]; 
  stats: any; 
  error: string | null; 
  onRetry: () => void;
  onDataChange: () => void;
}) {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
            {/* Header pharmacie */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Pill className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">PharmaGestion</h1>
              </div>
              <p className="text-gray-600">Système de gestion de stock pharmaceutique</p>
            </div>

            {/* Carte d'erreur */}
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="text-center space-y-4">
                <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Service Indisponible</h2>
                  <p className="text-gray-600 text-sm">
                    Le système de gestion est temporairement indisponible. 
                    Veuillez réessayer dans quelques instants.
                  </p>
                </div>

                <Button
                  onClick={onRetry}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Header fixe */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PharmaGestion</h1>
                <p className="text-sm text-gray-600">Gestion de stock intelligente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="text-right">
                <p className="font-semibold">{medications.length} médicaments</p>
                <p className="text-xs">{stats?.formattedTotalValue}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">PG</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Indicateurs rapides - MAINTENANT DYNAMIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Pill className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Stock</p>
                <p className="text-xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valeur Totale</p>
                <p className="text-xl font-bold text-gray-900">{stats?.formattedTotalValue || '0 €'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Thermometer className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Stock Bas</p>
                <p className="text-xl font-bold text-amber-600">{stats?.lowStock || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Syringe className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rupture</p>
                <p className="text-xl font-bold text-red-600">{stats?.outOfStock || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau principal */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Inventaire des Médicaments</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gestion en temps réel de votre stock pharmaceutique
                </p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Dernière mise à jour</p>
                <p className="font-medium">{new Date().toLocaleTimeString('fr-FR')}</p>
              </div>
            </div>
          </div>
          <MedicationsTable 
            initialMedications={medications} 
            onDataChange={onDataChange}
          />
        </div>

        {/* Dashboard détaillé */}
        {stats && <MedicationsDashboard stats={stats} />}

        {/* Pied de page */}
        <footer className="text-center py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-semibold">PharmaGestion</span> • 
                Version 2.1.0 • 
                {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}