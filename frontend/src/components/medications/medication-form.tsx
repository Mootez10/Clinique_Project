'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Medication, CreateMedicationDto, UpdateMedicationDto } from '@/types/medication';
import { AlertCircle, Calculator } from 'lucide-react';
import { medicationsApi } from '@/lib/api/medications';

interface MedicationFormProps {
  medication?: Medication;
  onSubmit: (data: CreateMedicationDto | UpdateMedicationDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultCategories = [
  'Antibiotique',
  'Antidouleur',
  'Cardiovasculaire',
  'Digestif',
  'Dermatologique',
  'Neurologique',
  'Psychiatrique',
  'Respiratoire',
  'Endocrinien',
  'Autre',
];

export function MedicationForm({ medication, onSubmit, onCancel, isLoading = false }: MedicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    minStock: '',
    maxStock: '',
    supplier: '',
    expirationDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>(defaultCategories);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name || '',
        description: medication.description || '',
        category: medication.category?.trim() || '',
        price: medication.price.toString(),
        quantity: medication.quantity.toString(),
        minStock: medication.minStock.toString(),
        maxStock: medication.maxStock.toString(),
        supplier: medication.supplier || '',
        expirationDate: medication.expirationDate.split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        minStock: '',
        maxStock: '',
        supplier: '',
        expirationDate: '',
      });
    }
  }, [medication]);

  const loadCategories = async () => {
    try {
      const cats = await medicationsApi.getCategories();
      // Filtrer et valider les catégories
      const validCategories = cats
        .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
        .map(c => c.trim());
      
      // Fusionner avec les catégories par défaut et éliminer les doublons
      const mergedCategories = [...new Set([...defaultCategories, ...validCategories])];
      setCategories(mergedCategories);
    } catch {
      // En cas d'erreur, utiliser les catégories par défaut
      setCategories(defaultCategories);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (value: string) => {
    // S'assurer que la valeur n'est jamais vide
    if (value && value.trim().length > 0) {
      setFormData(prev => ({ ...prev, category: value }));
      if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const calculateOptimalStock = () => {
    const min = parseInt(formData.minStock) || 0;
    const max = parseInt(formData.maxStock) || 0;
    if (min > 0 && max > 0) {
      setFormData(prev => ({ ...prev, quantity: Math.round((min + max) / 2).toString() }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.category.trim()) newErrors.category = 'La catégorie est requise';

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) newErrors.price = 'Prix > 0';
    if (price > 10000) newErrors.price = 'Prix ≤ 10000€';

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) newErrors.quantity = 'Quantité ≥ 0';

    const minStock = parseInt(formData.minStock);
    if (isNaN(minStock) || minStock < 0) newErrors.minStock = 'Stock min ≥ 0';

    const maxStock = parseInt(formData.maxStock);
    if (isNaN(maxStock) || maxStock < 0) newErrors.maxStock = 'Stock max ≥ 0';

    if (minStock > maxStock) newErrors.minStock = 'Min ≤ Max';

    if (!formData.supplier.trim()) newErrors.supplier = 'Fournisseur requis';

    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Date requise';
    } else {
      const exp = new Date(formData.expirationDate);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (exp < today) newErrors.expirationDate = 'Date future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      maxStock: parseInt(formData.maxStock),
      supplier: formData.supplier.trim(),
      expirationDate: formData.expirationDate,
    });
  };

  // Filtrer les catégories pour s'assurer qu'elles sont valides
  const validCategories = categories.filter(cat => 
    typeof cat === 'string' && cat.trim().length > 0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nom */}
        <div className="space-y-3">
          <Label htmlFor="name">Nom <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Nom du médicament"
          />
          {errors.name && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Catégorie - CORRIGÉ */}
        <div className="space-y-3">
          <Label>Catégorie <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.category} 
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className={`h-12 ${errors.category ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {validCategories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Prix */}
        <div className="space-y-3">
          <Label htmlFor="price">Prix (€) <span className="text-red-500">*</span></Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            max="10000"
            value={formData.price}
            onChange={handleChange}
            className={`h-12 ${errors.price ? 'border-red-500' : ''}`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.price}
            </p>
          )}
        </div>

        {/* Fournisseur */}
        <div className="space-y-3">
          <Label htmlFor="supplier">Fournisseur <span className="text-red-500">*</span></Label>
          <Input
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className={`h-12 ${errors.supplier ? 'border-red-500' : ''}`}
            placeholder="Nom du fournisseur"
          />
          {errors.supplier && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.supplier}
            </p>
          )}
        </div>

        {/* Stock Minimum */}
        <div className="space-y-3">
          <Label htmlFor="minStock">Stock Minimum <span className="text-red-500">*</span></Label>
          <Input
            id="minStock"
            name="minStock"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={handleChange}
            className={`h-12 ${errors.minStock ? 'border-red-500' : ''}`}
            placeholder="0"
          />
          {errors.minStock && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.minStock}
            </p>
          )}
        </div>

        {/* Stock Maximum */}
        <div className="space-y-3">
          <Label htmlFor="maxStock">Stock Maximum <span className="text-red-500">*</span></Label>
          <Input
            id="maxStock"
            name="maxStock"
            type="number"
            min="0"
            value={formData.maxStock}
            onChange={handleChange}
            className={`h-12 ${errors.maxStock ? 'border-red-500' : ''}`}
            placeholder="0"
          />
          {errors.maxStock && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.maxStock}
            </p>
          )}
        </div>

        {/* Quantité */}
        <div className="space-y-3">
          <Label htmlFor="quantity">Quantité <span className="text-red-500">*</span></Label>
          <div className="flex gap-2">
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className={`h-12 flex-1 ${errors.quantity ? 'border-red-500' : ''}`}
              placeholder="0"
            />
            <Button
              type="button"
              variant="outline"
              onClick={calculateOptimalStock}
              className="h-12"
            >
              <Calculator className="w-4 h-4" />
            </Button>
          </div>
          {errors.quantity && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Date d'expiration */}
        <div className="space-y-3">
          <Label htmlFor="expirationDate">Date d'expiration <span className="text-red-500">*</span></Label>
          <Input
            id="expirationDate"
            name="expirationDate"
            type="date"
            value={formData.expirationDate}
            onChange={handleChange}
            className={`h-12 ${errors.expirationDate ? 'border-red-500' : ''}`}
          />
          {errors.expirationDate && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.expirationDate}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description du médicament (optionnel)"
          rows={3}
        />
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Chargement...' : medication ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}