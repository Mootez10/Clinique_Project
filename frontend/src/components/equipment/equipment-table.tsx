'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Equipment, equipmentApi, handleApiError } from '@/lib/apiequipement';
import { EquipmentForm } from './equipment-form';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  MoreVertical,
  AlertTriangle,
  Package,
  DollarSign,
  MapPin,
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  Sparkles,
  Zap,
  History,
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryWarning,
  Eye,
  Star,
  Crown,
  Loader2
} from 'lucide-react';

export function EquipmentTable() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'}>({ key: 'name', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [error, setError] = useState<string>('');

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await equipmentApi.getAll();
      setEquipment(response.data);
    } catch (error: any) {
      console.error('Erreur chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const sortedEquipment = useMemo(() => {
    const sortableItems = [...equipment];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof Equipment];
        let bValue: any = b[sortConfig.key as keyof Equipment];

        if (sortConfig.key === 'quantity' || sortConfig.key === 'minStock' || sortConfig.key === 'unitPrice') {
          aValue = typeof aValue === 'string' ? parseFloat(aValue) : aValue;
          bValue = typeof bValue === 'string' ? parseFloat(bValue) : bValue;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [equipment, sortConfig]);

  const filteredEquipment = useMemo(() => {
    return sortedEquipment.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'low' && item.quantity <= item.minStock && item.quantity > 0) ||
                          (stockFilter === 'out' && item.quantity === 0);
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [sortedEquipment, searchTerm, categoryFilter, stockFilter]);

  // Statistiques avancées
  const stats = useMemo(() => {
    const totalItems = equipment.length;
    const lowStockItems = equipment.filter(item => item.quantity <= item.minStock && item.quantity > 0).length;
    const outOfStockItems = equipment.filter(item => item.quantity === 0).length;
    const totalValue = equipment.reduce((sum, item) => {
      const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
      return sum + (item.quantity * unitPrice);
    }, 0);

    const criticalItems = equipment.filter(item => item.quantity === 0).length;
    const warningItems = equipment.filter(item => item.quantity > 0 && item.quantity <= item.minStock).length;
    const healthyItems = equipment.filter(item => item.quantity > item.minStock).length;
    
    const avgStockLevel = equipment.length > 0 ? 
      equipment.reduce((sum, item) => sum + (item.quantity / Math.max(item.minStock, 1)), 0) / equipment.length : 0;

    const highValueItems = equipment.filter(item => {
      const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
      return (item.quantity * unitPrice) > 1000;
    }).length;

    return { 
      totalItems, 
      lowStockItems, 
      outOfStockItems, 
      totalValue,
      criticalItems,
      warningItems,
      healthyItems,
      avgStockLevel,
      highValueItems
    };
  }, [equipment]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(equipment.map(item => item.category))];
    return uniqueCategories;
  }, [equipment]);

  const handleSelectAll = () => {
    if (selectedItems.length === filteredEquipment.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredEquipment.map(item => item.id));
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cet équipement ?')) {
      try {
        await equipmentApi.delete(id);
        await loadEquipment();
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      } catch (error: any) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression: ' + handleApiError(error));
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStockStatus = (item: Equipment) => {
    if (item.quantity === 0) return { 
      text: 'Rupture', 
      variant: 'destructive' as const,
      icon: BatteryWarning,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      level: 0
    };
    if (item.quantity <= item.minStock) return { 
      text: 'Stock bas', 
      variant: 'secondary' as const,
      icon: BatteryLow,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      level: 1
    };
    return { 
      text: 'En stock', 
      variant: 'default' as const,
      icon: BatteryFull,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      level: 2
    };
  };

  const getStockPercentage = (item: Equipment) => {
    const maxStock = Math.max(item.minStock * 2, item.quantity);
    return maxStock > 0 ? Math.min((item.quantity / maxStock) * 100, 100) : 0;
  };

  const SortableHeader = ({ children, sortKey }: { children: React.ReactNode; sortKey: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig.key === sortKey && (
          <TrendingUp className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
        )}
      </div>
    </TableHead>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des équipements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-sm mt-1">{error}</p>
            <Button onClick={loadEquipment} className="mt-3">
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête premium avec indicateurs avancés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Équipements</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalItems}</div>
            <p className="text-xs text-blue-600 mt-2">
              {stats.healthyItems} en bon état
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-700">Attention Requise</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.warningItems + stats.criticalItems}</div>
            <p className="text-xs text-orange-600 mt-2">
              {stats.warningItems} bas • {stats.criticalItems} rupture
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Valeur du Stock</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.totalValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-green-600 mt-2">
              {stats.highValueItems} équipements haute valeur
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Niveau de Stock</CardTitle>
            <Battery className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {Math.round(stats.avgStockLevel * 100)}%
            </div>
            <p className="text-xs text-purple-600 mt-2">
              Moyenne du niveau de stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes intelligentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats.criticalItems > 0 && (
          <Alert className="bg-red-50 border-red-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <AlertDescription className="text-red-800">
                  <strong>Urgence : {stats.criticalItems} équipement(s) en rupture de stock</strong>
                  <p className="text-sm mt-1">Commande immédiate recommandée</p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {stats.warningItems > 0 && (
          <Alert className="bg-orange-50 border-orange-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <AlertDescription className="text-orange-800">
                  <strong>Attention : {stats.warningItems} équipement(s) en stock bas</strong>
                  <p className="text-sm mt-1">Planifiez le réapprovisionnement</p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </div>

      {/* Barre d'outils premium */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Gestion du Stock
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Gestion avancée avec analytics en temps réel
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <EquipmentForm onSuccess={loadEquipment} />
              
              {/* Toggle de mode de vue */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-none"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Tableau
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Grille
                </Button>
              </div>

              <Button variant="outline" onClick={handlePrint} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Barre d'actions batch */}
          {selectedItems.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {selectedItems.length} sélectionné(s)
                  </Badge>
                  <span className="text-sm text-blue-700">
                    Actions groupées disponibles
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedItems([])}
                    className="border-gray-300"
                  >
                    Tout désélectionner
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Filtres et recherche avancés */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un équipement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white border-gray-300">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="bg-white border-gray-300">
                <Battery className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="État du stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les stocks</SelectItem>
                <SelectItem value="low">Stock bas</SelectItem>
                <SelectItem value="out">En rupture</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      <History className="h-4 w-4 mr-2" />
                      Tri: {sortConfig.direction === 'asc' ? 'Croissant' : 'Décroissant'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cliquez sur les en-têtes pour trier</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Tableau ou Grille */}
          {viewMode === 'table' ? (
            <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredEquipment.length && filteredEquipment.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <SortableHeader sortKey="name">Équipement</SortableHeader>
                    <SortableHeader sortKey="category">Catégorie</SortableHeader>
                    <SortableHeader sortKey="quantity">Stock</SortableHeader>
                    <SortableHeader sortKey="unitPrice">Prix Unitaire</SortableHeader>
                    <SortableHeader sortKey="quantity">Valeur</SortableHeader>
                    <SortableHeader sortKey="supplier">Fournisseur</SortableHeader>
                    <TableHead>Emplacement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <div className="text-lg font-medium">Aucun équipement trouvé</div>
                        <p className="text-sm mt-1">Ajustez vos filtres ou ajoutez un nouvel équipement</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipment.map((item) => {
                      const stockStatus = getStockStatus(item);
                      const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
                      const totalValue = item.quantity * unitPrice;
                      const stockPercentage = getStockPercentage(item);
                      const StatusIcon = stockStatus.icon;
                      
                      return (
                        <TableRow key={item.id} className={
                          item.quantity === 0 ? 'bg-red-50 hover:bg-red-100' : 
                          item.quantity <= item.minStock ? 'bg-orange-50 hover:bg-orange-100' : 
                          'hover:bg-gray-50'
                        }>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold text-gray-900 flex items-center gap-2">
                                {item.name}
                                {totalValue > 5000 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Star className="h-4 w-4 text-yellow-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Équipement haute valeur</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              {item.description && (
                                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <StatusIcon className={`h-4 w-4 ${stockStatus.color}`} />
                                <span className={
                                  item.quantity === 0 ? 'font-bold text-red-600' :
                                  item.quantity <= item.minStock ? 'font-bold text-orange-600' :
                                  'font-semibold text-gray-900'
                                }>
                                  {item.quantity}
                                </span>
                                <span className="text-sm text-gray-500">
                                  / {item.minStock} min
                                </span>
                              </div>
                              <Progress value={stockPercentage} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {unitPrice.toLocaleString('fr-FR', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            })}
                          </TableCell>
                          <TableCell className="font-semibold text-green-700">
                            {totalValue.toLocaleString('fr-FR', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            })}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {item.supplier || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700">{item.location || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={stockStatus.variant}
                              className={
                                stockStatus.variant === 'destructive' ? 'bg-red-100 text-red-800 border-red-200' :
                                stockStatus.variant === 'secondary' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                'bg-green-100 text-green-800 border-green-200'
                              }
                            >
                              {stockStatus.text}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                  <EquipmentForm 
                                    equipment={item} 
                                    onSuccess={loadEquipment} 
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(item.id)}
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Vue Grille
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => {
                const stockStatus = getStockStatus(item);
                const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
                const totalValue = item.quantity * unitPrice;
                const stockPercentage = getStockPercentage(item);
                const StatusIcon = stockStatus.icon;

                return (
                  <Card key={item.id} className={`border-l-4 ${
                    stockStatus.level === 0 ? 'border-l-red-500' :
                    stockStatus.level === 1 ? 'border-l-orange-500' :
                    'border-l-green-500'
                  } hover:shadow-lg transition-all duration-300`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-bold flex items-center gap-2">
                            {item.name}
                            {totalValue > 5000 && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                          </CardTitle>
                          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                            {item.category}
                          </Badge>
                        </div>
                        <StatusIcon className={`h-6 w-6 ${stockStatus.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Stock actuel</span>
                          <span className={`font-bold ${
                            item.quantity === 0 ? 'text-red-600' :
                            item.quantity <= item.minStock ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {item.quantity} / {item.minStock}
                          </span>
                        </div>
                        <Progress value={stockPercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Prix unitaire</div>
                          <div className="font-semibold">
                            {unitPrice.toLocaleString('fr-FR', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Valeur totale</div>
                          <div className="font-semibold text-green-600">
                            {totalValue.toLocaleString('fr-FR', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            })}
                          </div>
                        </div>
                      </div>

                      {(item.supplier || item.location) && (
                        <div className="border-t pt-3 space-y-2">
                          {item.supplier && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">🏢</span>
                              {item.supplier}
                            </div>
                          )}
                          {item.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {item.location}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between pt-3">
                        <Badge 
                          variant={stockStatus.variant}
                          className={
                            stockStatus.variant === 'destructive' ? 'bg-red-100 text-red-800 border-red-200' :
                            stockStatus.variant === 'secondary' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            'bg-green-100 text-green-800 border-green-200'
                          }
                        >
                          {stockStatus.text}
                        </Badge>
                        <EquipmentForm 
                          equipment={item} 
                          onSuccess={loadEquipment} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Résumé */}
          <div className="flex justify-between items-center mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
            <div className="text-sm text-gray-600">
              Affichage de <strong>{filteredEquipment.length}</strong> équipement(s)
              {selectedItems.length > 0 && (
                <span className="ml-2 text-blue-600">
                  • {selectedItems.length} sélectionné(s)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="font-semibold text-gray-700">
                Valeur totale: {' '}
                {filteredEquipment.reduce((sum, item) => {
                  const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
                  return sum + (item.quantity * unitPrice);
                }, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}