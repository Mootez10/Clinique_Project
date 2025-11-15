'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Medication } from '@/types/medication';
import { MedicationForm } from './medication-form';
import { medicationsApi } from '@/lib/api/medications';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Search, 
  Filter,
  Download,
  Package
} from 'lucide-react';

interface MedicationsTableProps {
  initialMedications: Medication[];
  onDataChange: () => void;
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
  'Autre'
];

export function MedicationsTable({ initialMedications, onDataChange }: MedicationsTableProps) {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>(initialMedications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [deletingMedication, setDeletingMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>(defaultCategories);

  // Mettre à jour les médicaments quand les props changent
  useEffect(() => {
    setMedications(initialMedications);
  }, [initialMedications]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterMedications();
  }, [medications, searchTerm, categoryFilter]);

  const loadCategories = async () => {
    try {
      const cats = await medicationsApi.getCategories();
      // Fusionner les catégories par défaut avec celles de la base de données
      const allCategories = [...new Set([...defaultCategories, ...cats])];
      // Filtrer les catégories vides, nulles ou undefined
      const validCategories = allCategories.filter(cat => 
        cat !== null && cat !== undefined && typeof cat === 'string' && cat.trim() !== ''
      );
      setCategories(validCategories);
    } catch (error) {
      console.warn('Impossible de charger les catégories, utilisation des catégories par défaut');
      setCategories(defaultCategories);
    }
  };

  const filterMedications = () => {
    let filtered = medications;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchLower) ||
        med.description?.toLowerCase().includes(searchLower) ||
        med.supplier.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter && categoryFilter !== '') {
      filtered = filtered.filter(med => med.category === categoryFilter);
    }

    setFilteredMedications(filtered);
  };

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    try {
      await medicationsApi.create(data);
      // Appeler le callback pour rafraîchir les données parentes
      onDataChange();
      setIsDialogOpen(false);
      // Recharger les catégories après création
      await loadCategories();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingMedication) return;
    
    setIsLoading(true);
    try {
      await medicationsApi.update(editingMedication.id, data);
      // Appeler le callback pour rafraîchir les données parentes
      onDataChange();
      setEditingMedication(null);
      setIsDialogOpen(false);
      // Recharger les catégories après modification
      await loadCategories();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!deletingMedication) return;
    
    try {
      await medicationsApi.delete(id);
      // Appeler le callback pour rafraîchir les données parentes
      onDataChange();
      setIsDeleteDialogOpen(false);
      setDeletingMedication(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setIsDialogOpen(true);
  };

  const confirmDelete = (medication: Medication) => {
    setDeletingMedication(medication);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMedication(null);
  };

  const getStockStatus = (medication: Medication) => {
    if (medication.quantity === 0) {
      return { label: 'Rupture', variant: 'destructive' as const, color: 'text-red-600 bg-red-100' };
    } else if (medication.quantity <= medication.minStock) {
      return { label: 'Stock bas', variant: 'destructive' as const, color: 'text-amber-600 bg-amber-100' };
    } else if (medication.quantity >= medication.maxStock * 0.8) {
      return { label: 'Stock élevé', variant: 'secondary' as const, color: 'text-emerald-600 bg-emerald-100' };
    } else {
      return { label: 'Normal', variant: 'default' as const, color: 'text-blue-600 bg-blue-100' };
    }
  };

  const exportToCSV = () => {
    const headers = ['Nom', 'Catégorie', 'Prix', 'Quantité', 'Stock Min', 'Stock Max', 'Fournisseur', 'Expiration'];
    const csvData = filteredMedications.map(med => [
      `"${med.name}"`,
      `"${med.category}"`,
      `${med.price}€`,
      med.quantity,
      med.minStock,
      med.maxStock,
      `"${med.supplier}"`,
      new Date(med.expirationDate).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medicaments.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtrer les catégories pour s'assurer qu'elles sont valides
  const validCategories = categories.filter(cat => 
    typeof cat === 'string' && cat.trim().length > 0
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-xl">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Gestion des Médicaments
              </CardTitle>
              <p className="text-slate-600 mt-2">
                Gérez votre inventaire de médicaments en temps réel
              </p>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Médicament
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un médicament, description ou fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-4">
              {/* Sélecteur de catégorie */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes catégories</SelectItem>
                  {validCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                className="border-slate-300 hover:bg-slate-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Tableau */}
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-900">Nom</TableHead>
                  <TableHead className="font-semibold text-slate-900">Catégorie</TableHead>
                  <TableHead className="font-semibold text-slate-900">Prix</TableHead>
                  <TableHead className="font-semibold text-slate-900">Quantité</TableHead>
                  <TableHead className="font-semibold text-slate-900">Statut</TableHead>
                  <TableHead className="font-semibold text-slate-900">Fournisseur</TableHead>
                  <TableHead className="font-semibold text-slate-900">Expiration</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedications.map((medication) => {
                  const status = getStockStatus(medication);
                  const isExpiringSoon = new Date(medication.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <TableRow 
                      key={medication.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            status.variant === 'destructive' ? 'bg-red-500' : 
                            status.variant === 'secondary' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`} />
                          <span className="font-semibold text-slate-800">{medication.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-300 text-slate-700">
                          {medication.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {medication.price}€
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {medication.quantity <= medication.minStock && medication.quantity > 0 && (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                          {medication.quantity === 0 && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={
                            medication.quantity === 0 ? 'text-red-600 font-semibold' :
                            medication.quantity <= medication.minStock ? 'text-amber-600 font-semibold' :
                            'text-slate-800'
                          }>
                            {medication.quantity}
                          </span>
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                medication.quantity === 0 ? 'bg-red-500' :
                                medication.quantity <= medication.minStock ? 'bg-amber-500' :
                                'bg-emerald-500'
                              }`}
                              style={{ 
                                width: `${Math.min(100, (medication.quantity / medication.maxStock) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {medication.supplier}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center space-x-2 ${
                          isExpiringSoon ? 'text-amber-600 font-semibold' : 'text-slate-700'
                        }`}>
                          {isExpiringSoon && <AlertTriangle className="w-3 h-3" />}
                          <span>{new Date(medication.expirationDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(medication)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDelete(medication)}
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredMedications.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  {medications.length === 0 ? 'Aucun médicament trouvé' : 'Aucun résultat pour votre recherche'}
                </p>
                <Button 
                  variant="link" 
                  onClick={() => { setSearchTerm(''); setCategoryFilter(''); }}
                  className="text-blue-600 hover:text-blue-700 mt-2"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {editingMedication ? 'Modifier le Médicament' : 'Nouveau Médicament'}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              {editingMedication 
                ? 'Modifiez les informations du médicament dans le formulaire ci-dessous.' 
                : 'Remplissez le formulaire pour ajouter un nouveau médicament à votre inventaire.'
              }
            </DialogDescription>
          </DialogHeader>
          <MedicationForm
            medication={editingMedication || undefined}
            onSubmit={editingMedication ? handleUpdate : handleCreate}
            onCancel={handleCloseDialog}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-slate-900">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span>Confirmer la suppression</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Êtes-vous sûr de vouloir supprimer le médicament &quot;{deletingMedication?.name}&quot; ? 
              Cette action est irréversible et le médicament sera marqué comme inactif dans le système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingMedication && handleDelete(deletingMedication.id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}