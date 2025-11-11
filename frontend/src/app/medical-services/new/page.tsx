'use client';

import { useRouter } from 'next/navigation';
import { medicalServiceApi } from '@/lib/api/medical-service';
import { MedicalServiceForm } from '@/components/medical-services/medical-service-form';
import { useToast } from '@/hooks/use-toast';
import { CreateMedicalServiceDto } from '@/types/medical-service';

export default function NewMedicalServicePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (values: CreateMedicalServiceDto) => {
    try {
      await medicalServiceApi.create(values);
      toast({
        title: 'Succès',
        description: 'Service médical créé avec succès',
      });
      router.push('/medical-services');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de créer le service',
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <MedicalServiceForm onSubmit={handleSubmit} />
    </div>
  );
}