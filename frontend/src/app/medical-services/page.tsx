'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Power, Filter } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export default function MedicalServicesPage() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [cliniques, setCliniques] = useState<Clinique[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">
                Services Médicaux
              </CardTitle>
              <CardDescription>
                Gérez les services médicaux de vos cliniques
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/medical-services/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Service
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedClinic} onValueChange={handleClinicFilter}>
              <SelectTrigger className="w-[300px]">
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Clinique</TableHead>
                <TableHead>Prix (DT)</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Aucun service trouvé
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>{service.clinique.name}</TableCell>
                  <TableCell>
  {(typeof service.price === 'string' ? Number(service.price) : service.price).toFixed(2)}
</TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>
                      <Badge
                        variant={service.isActive ? 'default' : 'secondary'}
                      >
                        {service.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/medical-services/${service.id}`)
                          }
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(service.id)}
                          title="Activer/Désactiver"
                        >
                          <Power
                            className={`h-4 w-4 ${
                              service.isActive
                                ? 'text-green-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/medical-services/${service.id}/edit`)
                          }
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(service.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le
              service médical.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}