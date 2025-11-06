'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewPrescriptionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const patientId = searchParams.get('patientId') || undefined;
  const patientName = searchParams.get('patientName') || undefined;
  const consultationId = searchParams.get('consultationId') || undefined;

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <PrescriptionForm
        patientId={patientId}
        patientName={patientName}
        consultationId={consultationId}
        onSuccess={() => {
          if (patientId) {
            router.push(`/patients/${patientId}`);
          } else {
            router.push('/prescriptions');
          }
        }}
      />
    </div>
  );
}