'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { medicalServiceApi } from '@/lib/api/medical-service';
import { MedicalServiceForm } from '@/components/medical-services/medical-service-form';
import { useToast } from '@/hooks/use-toast';
import { MedicalService, UpdateMedicalServiceDto } from '@/types/medical-service';

export default function EditMedicalServicePage() {
  const [service, setService] = useState<MedicalService | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await medicalServiceApi.getById(id);
      setService(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger le service',
      });
      router.push('/medical-services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: UpdateMedicalServiceDto) => {
    try {
      await medicalServiceApi.update(id, values);
      toast({
        title: 'Succès',
        description: 'Service médical mis à jour avec succès',
      });
      router.push('/medical-services');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le service',
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <MedicalServiceForm
        initialData={{
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          cliniqueId: service.clinique.id,
          isActive: service.isActive,
        }}
        onSubmit={handleSubmit}
        isEditing
      />
    </div>
  );
}