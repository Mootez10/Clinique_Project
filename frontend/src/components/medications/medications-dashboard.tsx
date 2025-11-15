'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Pill, 
  Syringe, 
  Heart, 
  Thermometer,
  RefreshCw
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { medicationsApi } from '@/lib/api/medications';

interface MedicationStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
  totalValue: number;
  formattedTotalValue?: string;
  categoriesCount?: number;
  criticalItems?: number;
}

interface MedicationsDashboardProps {
  stats: MedicationStats | null;
}

export function MedicationsDashboard({ stats: initialStats }: MedicationsDashboardProps) {
  const [stats, setStats] = useState<MedicationStats | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // S'assurer que le code ne s'exécute que côté client
  useEffect(() => {
    setIsClient(true);
    setStats(initialStats);
    setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
  }, [initialStats]);

  // Fonction pour rafraîchir les données
  const refreshStats = async () => {
    if (!isClient) return;
    
    setIsRefreshing(true);
    try {
      const [medicationsData, statsData] = await Promise.allSettled([
        medicationsApi.getAll(),
        medicationsApi.getStats()
      ]);

      let newStats: MedicationStats | null = null;

      if (medicationsData.status === 'fulfilled') {
        const medications = medicationsData.value;
        
        // Calcul en temps réel basé sur les données actuelles
        const totalValue = medications.reduce((sum, med) => {
          return sum + (med.price * med.quantity);
        }, 0);

        const now = new Date();
        const soon = new Date(now);
        soon.setDate(soon.getDate() + 30);

        newStats = {
          total: medications.length,
          lowStock: medications.filter(m => m.quantity <= m.minStock && m.quantity > 0).length,
          outOfStock: medications.filter(m => m.quantity === 0).length,
          expiringSoon: medications.filter(m => {
            const exp = new Date(m.expirationDate);
            return exp <= soon && exp >= now;
          }).length,
          totalValue,
          formattedTotalValue: new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
          }).format(totalValue),
          categoriesCount: new Set(medications.map(m => m.category)).size,
          criticalItems: medications.filter(m => 
            m.quantity === 0 || (m.quantity <= m.minStock && m.quantity > 0)
          ).length,
        };

        // Fusion avec les stats serveur si disponibles
        if (statsData.status === 'fulfilled') {
          newStats = { ...newStats, ...statsData.value };
        }
      }

      setStats(newStats);
      setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Rafraîchissement automatique toutes les 30 secondes (client seulement)
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, [isClient]);

  const statCards = [
    {
      title: 'Médicaments en Stock',
      value: stats?.total || 0,
      icon: Pill,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Produits disponibles',
      trend: stats?.total && initialStats?.total ? stats.total - initialStats.total : 0
    },
    {
      title: 'Valeur du Stock',
      value: stats?.formattedTotalValue || '0,00 €',
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Valeur totale',
      trend: stats?.totalValue && initialStats?.totalValue ? stats.totalValue - initialStats.totalValue : 0
    },
    {
      title: 'Stocks Bas',
      value: stats?.lowStock || 0,
      icon: Thermometer,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      description: 'Niveau critique',
      trend: stats?.lowStock && initialStats?.lowStock ? stats.lowStock - initialStats.lowStock : 0
    },
    {
      title: 'Ruptures de Stock',
      value: stats?.outOfStock || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      description: 'À réapprovisionner',
      trend: stats?.outOfStock && initialStats?.outOfStock ? stats.outOfStock - initialStats.outOfStock : 0
    },
    {
      title: 'Expirent Bientôt',
      value: stats?.expiringSoon || 0,
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Dans 30 jours',
      trend: stats?.expiringSoon && initialStats?.expiringSoon ? stats.expiringSoon - initialStats.expiringSoon : 0
    },
    {
      title: 'Catégories',
      value: stats?.categoriesCount || 0,
      icon: Package,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      description: 'Diversité produits',
      trend: stats?.categoriesCount && initialStats?.categoriesCount ? stats.categoriesCount - initialStats.categoriesCount : 0
    }
  ];

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (trend < 0) return <TrendingUp className="h-3 w-3 text-green-500 transform rotate-180" />;
    return null;
  };

  const getTrendText = (trend: number) => {
    if (trend > 0) return `+${trend}`;
    if (trend < 0) return `${trend}`;
    return 'Stable';
  };

  // Rendu initial vide côté serveur
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Tableau de Bord</h2>
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Chargement...
                </CardTitle>
                <div className="p-2 rounded-lg bg-gray-200 animate-pulse">
                  <div className="h-4 w-4 bg-gray-300 rounded"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête du dashboard avec bouton de rafraîchissement */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tableau de Bord</h2>
          <p className="text-sm text-gray-600">
            Données en temps réel • Dernière mise à jour : {lastUpdate}
          </p>
        </div>
        <button
          onClick={refreshStats}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Rafraîchir</span>
        </button>
      </div>

      {/* Grille des indicateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <Card 
            key={index} 
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={refreshStats}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.textColor}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                {card.trend !== 0 && (
                  <div className="flex items-center space-x-1 text-xs">
                    {getTrendIcon(card.trend)}
                    <span className={card.trend > 0 ? 'text-red-600' : 'text-green-600'}>
                      {getTrendText(card.trend)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{card.description}</p>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full ${card.color}`}></div>
                  <div className={`w-2 h-2 rounded-full ${card.color} opacity-60`}></div>
                  <div className={`w-2 h-2 rounded-full ${card.color} opacity-30`}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Indicateurs de performance */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Taux de Disponibilité</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats.total > 0 ? Math.round(((stats.total - stats.outOfStock) / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Stock Optimal</p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.total > 0 ? Math.round(((stats.total - stats.lowStock - stats.outOfStock) / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Syringe className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">Alertes Actives</p>
                <p className="text-2xl font-bold text-amber-700">
                  {stats.criticalItems || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Légende et informations */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3 text-red-500" />
            <span>Augmentation</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3 text-green-500 transform rotate-180" />
            <span>Diminution</span>
          </div>
        </div>
        <div className="text-right">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            ✓ Données dynamiques
          </span>
        </div>
      </div>
    </div>
  );
}