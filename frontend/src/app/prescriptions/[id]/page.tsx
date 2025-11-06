'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { prescriptionService } from '@/services/prescription.service';
import { Prescription } from '@/types/prescription';
import { PrescriptionPrint } from '@/components/prescriptions/PrescriptionPrint';

export default function PrescriptionViewPage() {
  const params = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPrescription();
  }, [params.id]);

  const loadPrescription = async () => {
    try {
      const data = await prescriptionService.getById(params.id as string);
      setPrescription(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement de l\'ordonnance');
    } finally {
      setIsLoading(false);
    }
  };

  // Impression native du navigateur
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Chargement de l'ordonnance...</p>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Ordonnance non trouvée</p>
        <Button onClick={() => router.back()} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Barre d'actions */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      {/* Aperçu de l'ordonnance */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <PrescriptionPrint ref={printRef} prescription={prescription} />
      </div>
    </div>
  );
}