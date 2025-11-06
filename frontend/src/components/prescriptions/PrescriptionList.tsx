'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Printer, Trash2 } from 'lucide-react';
import { prescriptionService } from '@/services/prescription.service';
import { Prescription } from '@/types/prescription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrescriptionListProps {
  patientId?: string;
}

export function PrescriptionList({ patientId }: PrescriptionListProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, [patientId]);

  const loadPrescriptions = async () => {
    try {
      const data = patientId
        ? await prescriptionService.getByPatient(patientId)
        : await prescriptionService.getAll();
      setPrescriptions(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance ?')) return;
    try {
      await prescriptionService.delete(id);
      loadPrescriptions();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune ordonnance trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <Card key={prescription.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  Ordonnance du{' '}
                  {format(new Date(prescription.date), 'dd MMMM yyyy', { locale: fr })}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
  Patient: {prescription.patient?.firstName || prescription.patientFirstName || 'N/A'}{' '}
  {prescription.patient?.lastName || prescription.patientLastName || ''}
</p>
                <p className="text-sm text-gray-500">
                  Médecin: {prescription.doctorName}
                  {prescription.doctorSpecialty && ` - ${prescription.doctorSpecialty}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/prescriptions/${prescription.id}`, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/prescriptions/${prescription.id}/print`, '_blank')}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(prescription.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Médicaments prescrits:</h4>
              <ul className="list-disc list-inside space-y-1">
                {prescription.items.map((item, idx) => (
                  <li key={idx} className="text-sm">
                    <strong>{item.medicationName}</strong> - {item.dosage} -{' '}
                    {item.frequency} pendant {item.duration}
                  </li>
                ))}
              </ul>
              {prescription.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm">
                    <strong>Conseils:</strong> {prescription.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}