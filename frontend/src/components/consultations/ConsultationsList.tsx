'use client';

import { useState, useEffect } from 'react';
import { consultationsApi, Consultation } from '@/services/consultations.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

interface ConsultationsListProps {
  onEdit?: (consultation: Consultation) => void;
  onView?: (consultation: Consultation) => void;
  onCreate?: () => void;
}

export default function ConsultationsList({ onEdit, onView, onCreate }: ConsultationsListProps) {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConsultations = async () => {
    try {
      const data = await consultationsApi.getAll();
      setConsultations(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les consultations.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette consultation ?')) return;

    try {
      await consultationsApi.delete(id);
      toast({
        title: 'Consultation supprimée',
        description: 'La consultation a été supprimée avec succès.',
      });
      loadConsultations();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la consultation.',
        variant: 'destructive',
      });
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      en_cours: 'default',
      terminee: 'secondary',
      annulee: 'destructive',
    };

    const labels: Record<string, string> = {
      en_cours: 'En cours',
      terminee: 'Terminée',
      annulee: 'Annulée',
    };

    return (
      <Badge variant={variants[statut] || 'default'}>
        {labels[statut] || statut}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Chargement des consultations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Consultations Médicales</CardTitle>
            <CardDescription>Gérez toutes les consultations de vos patients</CardDescription>
          </div>
          {onCreate && (
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Consultation
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {consultations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune consultation enregistrée pour le moment.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Médecin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">
                      {formatDate(consultation.dateConsultation)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{consultation.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {consultation.patientAge && `${consultation.patientAge} ans`}
                          {consultation.patientAge && consultation.patientGender && ' • '}
                          {consultation.patientGender === 'M' && 'Homme'}
                          {consultation.patientGender === 'F' && 'Femme'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {consultation.motif}
                    </TableCell>
                    <TableCell>{consultation.medecinName}</TableCell>
                    <TableCell>{getStatutBadge(consultation.statut)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(consultation)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(consultation)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(consultation.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}