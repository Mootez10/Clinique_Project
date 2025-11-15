'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Equipment, equipmentApi, CreateEquipmentRequest, UpdateEquipmentRequest, handleApiError } from '@/lib/apiequipement';
import { Plus, Edit, Loader2, AlertTriangle, CheckCircle, Package, Zap, Sparkles, Calculator, Target, TrendingUp, Clock, Shield } from 'lucide-react';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSuccess: () => void;
}

const categories = [
  'Diagnostic',
  'Urgences', 
  'Réanimation',
  'Traitement',
  'Monitoring',
  'Consommable',
  'Protection',
  'Soins',
  'Chirurgie',
  'Mobilité'
];

const priorityLevels = [
  { value: 'low', label: 'Basse', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critique', color: 'bg-red-100 text-red-800' },
];

export function EquipmentForm({ equipment, onSuccess }: EquipmentFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculations, setCalculations] = useState({
    totalValue: 0,
    reorderTime: 7,
    safetyStock: 0
  });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    minStock: 0,
    unitPrice: 0,
    supplier: '',
    location: '',
  });

  // Reset form when equipment changes or dialog opens/closes
  useEffect(() => {
    if (equipment && open) {
      setFormData({
        name: equipment.name || '',
        description: equipment.description || '',
        category: equipment.category || '',
        quantity: equipment.quantity || 0,
        minStock: equipment.minStock || 0,
        unitPrice: equipment.unitPrice || 0,
        supplier: equipment.supplier || '',
        location: equipment.location || '',
      });
    } else if (!equipment && open) {
      setFormData({
        name: '',
        description: '',
        category: '',
        quantity: 0,
        minStock: 0,
        unitPrice: 0,
        supplier: '',
        location: '',
      });
    }
    setErrors({});
    setQuickActionLoading(null);
  }, [equipment, open]);

  // Calculs automatiques en temps réel
  useEffect(() => {
    const totalValue = formData.quantity * formData.unitPrice;
    const safetyStock = Math.round(formData.minStock * 0.2);
    
    setCalculations({
      totalValue,
      reorderTime: 7,
      safetyStock
    });
  }, [formData.quantity, formData.unitPrice, formData.minStock]);

  // Calcul du statut en temps réel
  const getCurrentStatus = () => {
    if (formData.quantity === 0) {
      return { 
        status: 'RUPTURE CRITIQUE', 
        color: 'text-red-600', 
        bgColor: 'bg-red-50', 
        icon: AlertTriangle,
        level: 'critical',
        description: 'Commande urgente nécessaire'
      };
    } else if (formData.quantity <= formData.minStock) {
      const ratio = (formData.quantity / formData.minStock) * 100;
      if (ratio <= 30) {
        return { 
          status: 'STOCK TRÈS BAS', 
          color: 'text-orange-600', 
          bgColor: 'bg-orange-50', 
          icon: AlertTriangle,
          level: 'high',
          description: 'Réapprovisionnement immédiat recommandé'
        };
      } else {
        return { 
          status: 'STOCK BAS', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-50', 
          icon: AlertTriangle,
          level: 'medium',
          description: 'Planifier la commande'
        };
      }
    } else if (formData.quantity <= formData.minStock * 1.5) {
      return { 
        status: 'STOCK OPTIMAL', 
        color: 'text-green-600', 
        bgColor: 'bg-green-50', 
        icon: CheckCircle,
        level: 'low',
        description: 'Niveau de stock idéal'
      };
    } else {
      return { 
        status: 'SURSTOCK', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50', 
        icon: Package,
        level: 'low',
        description: 'Stock au-dessus des recommandations'
      };
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.category.trim()) newErrors.category = 'La catégorie est requise';
    if (formData.quantity < 0) newErrors.quantity = 'La quantité doit être positive';
    if (formData.minStock < 0) newErrors.minStock = 'Le stock minimum doit être positif';
    if (formData.unitPrice < 0) newErrors.unitPrice = 'Le prix doit être positif';
    if (formData.minStock > 0 && formData.quantity < formData.minStock) {
      newErrors.quantity = 'La quantité est inférieure au stock minimum';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (equipment) {
        // Pour la modification
        const updateData: UpdateEquipmentRequest = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          quantity: Number(formData.quantity),
          minStock: Number(formData.minStock),
          unitPrice: Number(formData.unitPrice),
          supplier: formData.supplier,
          location: formData.location,
        };
        await equipmentApi.update(equipment.id, updateData);
      } else {
        // Pour la création
        const createData: CreateEquipmentRequest = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          quantity: Number(formData.quantity),
          minStock: Number(formData.minStock),
          unitPrice: Number(formData.unitPrice),
          supplier: formData.supplier,
          location: formData.location,
          isActive: true,
        };
        await equipmentApi.create(createData);
      }
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      const errorMessage = handleApiError(error);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // NOUVELLES FONCTIONS POUR LES ACTIONS RAPIDES QUI ENVOIENT DIRECTEMENT À L'API
  const handleQuickAction = async (action: 'rupture' | 'securite' | 'optimal') => {
    if (!equipment) return;

    setQuickActionLoading(action);
    setErrors({});

    try {
      let newQuantity = 0;
      
      switch (action) {
        case 'rupture':
          newQuantity = 0;
          break;
        case 'securite':
          newQuantity = calculations.safetyStock;
          break;
        case 'optimal':
          newQuantity = Math.round(formData.minStock * 1.2);
          break;
      }

      const updateData: UpdateEquipmentRequest = {
        quantity: newQuantity,
      };

      await equipmentApi.update(equipment.id, updateData);
      
      // Mettre à jour l'état local immédiatement
      setFormData(prev => ({ ...prev, quantity: newQuantity }));
      
      // Recharger les données
      onSuccess();
      
    } catch (error: any) {
      console.error('Erreur action rapide:', error);
      const errorMessage = handleApiError(error);
      setErrors({ submit: errorMessage });
    } finally {
      setQuickActionLoading(null);
    }
  };

  const getStockPercentage = () => {
    const maxStock = Math.max(formData.minStock * 2, formData.quantity);
    return maxStock > 0 ? Math.min((formData.quantity / maxStock) * 100, 100) : 0;
  };

  const currentStatus = getCurrentStatus();
  const StatusIcon = currentStatus.icon;
  const stockPercentage = getStockPercentage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {equipment ? (
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Sparkles className="h-4 w-4 mr-2" />
            Nouvel Équipement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            {equipment ? 'Modifier l\'Équipement' : 'Ajouter un Nouvel Équipement'}
          </DialogTitle>
        </DialogHeader>
        
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{errors.submit}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* En-tête avec indicateurs rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {calculations.totalValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </div>
              <div className="text-sm text-blue-600">Valeur totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">
                {formData.quantity}
              </div>
              <div className="text-sm text-green-600">Unités en stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-900">
                {calculations.safetyStock}
              </div>
              <div className="text-sm text-orange-600">Stock de sécurité</div>
            </div>
          </div>

          {/* Nom et Catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nom de l'équipement *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : 'border-gray-300'}
                placeholder="Ex: Stéthoscope Littmann Cardiology IV"
                required
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : 'border-gray-300'}>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description détaillée</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description complète, spécifications techniques, numéro de modèle..."
              rows={3}
              className="border-gray-300"
            />
          </div>

          {/* Indicateur de statut avancé */}
          <div className={`p-4 rounded-lg border-2 ${currentStatus.bgColor} ${currentStatus.color} border-current transition-all duration-500`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIcon className={`h-6 w-6 ${currentStatus.color}`} />
                <div>
                  <h3 className={`font-bold text-lg ${currentStatus.color}`}>
                    {currentStatus.status}
                  </h3>
                  <p className="text-sm opacity-80">
                    {currentStatus.description}
                  </p>
                </div>
              </div>
              <Badge className={priorityLevels.find(p => p.value === currentStatus.level)?.color}>
                Priorité: {priorityLevels.find(p => p.value === currentStatus.level)?.label}
              </Badge>
            </div>
            
            {/* Barre de progression détaillée */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Niveau de stock</span>
                <span className="font-semibold">{Math.round(stockPercentage)}%</span>
              </div>
              <Progress value={stockPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>Seuil critique: {Math.round(formData.minStock * 0.3)}</span>
                <span>Stock min: {formData.minStock}</span>
                <span>Stock optimal: {Math.round(formData.minStock * 1.5)}</span>
              </div>
            </div>

            {/* ACTIONS RAPIDES CORRIGÉES - ENVOIENT DIRECTEMENT À L'API */}
            {equipment && (
              <div className="flex space-x-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuickAction('rupture')}
                  disabled={quickActionLoading === 'rupture' || formData.quantity === 0}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  {quickActionLoading === 'rupture' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  {quickActionLoading === 'rupture' ? 'En cours...' : 'Marquer rupture'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuickAction('securite')}
                  disabled={quickActionLoading === 'securite'}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  {quickActionLoading === 'securite' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  {quickActionLoading === 'securite' ? 'En cours...' : 'Stock sécurité'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuickAction('optimal')}
                  disabled={quickActionLoading === 'optimal'}
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  {quickActionLoading === 'optimal' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Target className="h-4 w-4 mr-2" />
                  )}
                  {quickActionLoading === 'optimal' ? 'En cours...' : 'Stock optimal'}
                </Button>
              </div>
            )}
          </div>

          {/* Quantité, Stock Min, Prix avec calculs automatiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantité en stock *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className={errors.quantity ? 'border-red-500' : 'border-gray-300'}
                required
              />
              {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minStock" className="text-sm font-medium text-gray-700">
                Stock minimum *
              </Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                step="1"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                className={errors.minStock ? 'border-red-500' : 'border-gray-300'}
                required
              />
              {errors.minStock && <p className="text-red-500 text-xs">{errors.minStock}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-sm font-medium text-gray-700">
                Prix unitaire (€) *
              </Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className={errors.unitPrice ? 'border-red-500' : 'border-gray-300'}
                required
              />
              {errors.unitPrice && <p className="text-red-500 text-xs">{errors.unitPrice}</p>}
            </div>
          </div>

          {/* Fournisseur et Emplacement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">Fournisseur</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Ex: MedTech France SARL"
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Emplacement
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Bloc A - Armoire 1 - Étagère 3"
                className="border-gray-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {equipment ? 'Mettre à jour' : 'Créer l\'équipement'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}