'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Power, Filter, Stethoscope, Clock, DollarSign, Building } from 'lucide-react';
import { medicalServiceApi } from '@/lib/api/medical-service';
import { cliniqueApi } from '@/lib/api/clinique';
import { MedicalService } from '@/types/medical-service';
import { Clinique } from '@/types/clinique';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function MedicalServicesPage() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [cliniques, setCliniques] = useState<Clinique[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadCliniques();
    loadServices();
  }, []);

  const loadCliniques = async () => {
    try {
      const data = await cliniqueApi.getAll();
      setCliniques(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger les cliniques',
      });
    }
  };

  const loadServices = async (cliniqueId?: string) => {
    try {
      setLoading(true);
      const data = await medicalServiceApi.getAll(cliniqueId);
      setServices(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger les services',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClinicFilter = (value: string) => {
    setSelectedClinic(value);
    if (value === 'all') {
      loadServices();
    } else {
      loadServices(value);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await medicalServiceApi.toggleActive(id);
      toast({
        title: 'Succès',
        description: 'Statut du service modifié',
      });
      loadServices(selectedClinic === 'all' ? undefined : selectedClinic);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de modifier le statut',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await medicalServiceApi.delete(deleteId);
      toast({
        title: 'Succès',
        description: 'Service supprimé avec succès',
      });
      loadServices(selectedClinic === 'all' ? undefined : selectedClinic);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le service',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.clinique.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    totalValue: services.reduce((sum, service) => {
      const price = typeof service.price === 'string' ? Number(service.price) : service.price;
      return sum + price;
    }, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des services médicaux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services Médicaux</h1>
              <p className="text-gray-600 mt-1">Gestion complète des services de vos cliniques</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/medical-services/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Service
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Services Actifs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Power className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Valeur Totale</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalValue.toFixed(2)} $</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte principale */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Liste des Services</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Consultez et gérez tous les services médicaux de vos cliniques
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {filteredServices.length} services
                </Badge>
              </div>
            </div>

            {/* Barre de filtres et recherche */}
            <div className="flex flex-col lg:flex-row gap-4 mt-6">
              <div className="flex-1 relative">
                <Input
                  placeholder="Rechercher un service, une description ou une clinique..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 transition-colors h-11"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              
              <Select value={selectedClinic} onValueChange={handleClinicFilter}>
                <SelectTrigger className="w-[280px] h-11 border-gray-300 focus:border-blue-500">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Filtrer par clinique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les cliniques</SelectItem>
                  {cliniques.map((clinique) => (
                    <SelectItem key={clinique.id} value={clinique.id}>
                      {clinique.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900 py-4">Service Médical</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Clinique</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Prix</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Durée</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Stethoscope className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun service trouvé</h3>
                          <p className="text-gray-500 max-w-sm text-center">
                            {searchTerm || selectedClinic !== 'all' 
                              ? 'Aucun service ne correspond à vos critères de recherche.' 
                              : 'Aucun service médical n\'a été créé pour le moment.'
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServices.map((service) => (
                      <TableRow key={service.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-b-0 group">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Stethoscope className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{service.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{service.clinique.name}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-gray-900">
                              {(typeof service.price === 'string' ? Number(service.price) : service.price).toFixed(2)}$
                    
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-700">{service.duration} min</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge 
                            variant={service.isActive ? "default" : "secondary"} 
                            className={service.isActive 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {service.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/medical-services/${service.id}`)}
                              className="hover:bg-gray-100 text-gray-600"
                              title="Voir détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(service.id)}
                              className={`hover:bg-green-50 ${
                                service.isActive ? 'text-green-600' : 'text-gray-400'
                              }`}
                              title="Activer/Désactiver"
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/medical-services/${service.id}/edit`)}
                              className="hover:bg-blue-50 text-blue-600"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(service.id)}
                              className="hover:bg-red-50 text-red-600"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-gray-900">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span>Confirmer la suppression</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer ce service médical ? 
              Cette action est irréversible et supprimera définitivement le service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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