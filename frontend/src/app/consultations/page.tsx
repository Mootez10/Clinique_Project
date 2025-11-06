'use client';

import { useState } from 'react';
import ConsultationsList from '@/components/consultations/ConsultationsList';
import ConsultationForm from '@/components/consultations/ConsultationForm';
import ConsultationDetails from '@/components/consultations/ConsultationDetails';
import { Consultation } from '@/services/consultations.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export default function ConsultationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setSelectedConsultation(null);
    setViewMode('create');
  };

  const handleEdit = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setViewMode('edit');
  };

  const handleView = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setViewMode('view');
  };

  const handleSuccess = () => {
    setViewMode('list');
    setSelectedConsultation(null);
    setRefreshKey(prev => prev + 1); // Force la mise à jour de la liste
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedConsultation(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {viewMode === 'list' && (
        <ConsultationsList
          key={refreshKey}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">
              {viewMode === 'create' ? 'Nouvelle Consultation' : 'Modifier la Consultation'}
            </h1>
            <ConsultationForm
              consultation={selectedConsultation || undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {viewMode === 'view' && selectedConsultation && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Button variant="ghost" onClick={handleCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
            <Button onClick={() => handleEdit(selectedConsultation)}>
              Modifier
            </Button>
          </div>
          <ConsultationDetails consultation={selectedConsultation} />
        </div>
      )}
    </div>
  );
}