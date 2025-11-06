'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PrescriptionList } from '@/components/prescriptions/PrescriptionList';
import { useRouter } from 'next/navigation';

export default function PrescriptionsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ordonnances</h1>
        <Button onClick={() => router.push('/prescriptions/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle ordonnance
        </Button>
      </div>

      <PrescriptionList />
    </div>
  );
}