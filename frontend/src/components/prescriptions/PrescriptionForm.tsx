'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { prescriptionService } from '@/services/prescription.service';
import { CreatePrescriptionDto } from '@/types/prescription';

interface PrescriptionFormProps {
  patientId?: string;
  patientName?: string;
  consultationId?: string;
  onSuccess?: () => void;
}

export function PrescriptionForm({
  patientId,
  patientName,
  consultationId,
  onSuccess,
}: PrescriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      patientFirstName: '',
      patientLastName: '',
      patientDateOfBirth: '',
      patientPhone: '',
      doctorName: '',
      doctorSpecialty: '',
      notes: '',
      items: [
        {
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const prescriptionData: CreatePrescriptionDto = {
        ...data,
        patientId: patientId || undefined,
        consultationId,
      };
      await prescriptionService.create(prescriptionData);
      alert('Ordonnance créée avec succès !');
      onSuccess?.();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de l\'ordonnance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Nouvelle Ordonnance {patientName && `- ${patientName}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date */}
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Date requise' })}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Informations patient (si pas de patientId) */}
          {!patientId && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Informations du Patient</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientFirstName">Prénom *</Label>
                    <Input
                      id="patientFirstName"
                      {...register('patientFirstName', { required: 'Prénom requis' })}
                      placeholder="Jean"
                    />
                    {errors.patientFirstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.patientFirstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="patientLastName">Nom *</Label>
                    <Input
                      id="patientLastName"
                      {...register('patientLastName', { required: 'Nom requis' })}
                      placeholder="Dupont"
                    />
                    {errors.patientLastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.patientLastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="patientDateOfBirth">Date de naissance</Label>
                    <Input
                      id="patientDateOfBirth"
                      type="date"
                      {...register('patientDateOfBirth')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="patientPhone">Téléphone</Label>
                    <Input
                      id="patientPhone"
                      {...register('patientPhone')}
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations médecin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctorName">Nom du Médecin *</Label>
              <Input
                id="doctorName"
                {...register('doctorName', { required: 'Nom requis' })}
                placeholder="Dr. Martin Dupont"
              />
              {errors.doctorName && (
                <p className="text-sm text-red-500 mt-1">{errors.doctorName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="doctorSpecialty">Spécialité</Label>
              <Input
                id="doctorSpecialty"
                {...register('doctorSpecialty')}
                placeholder="Médecin généraliste"
              />
            </div>
          </div>

          {/* Médicaments */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Médicaments</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    medicationName: '',
                    dosage: '',
                    frequency: '',
                    duration: '',
                    instructions: '',
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un médicament
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Médicament {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nom du médicament *</Label>
                        <Input
                          {...register(`items.${index}.medicationName`, {
                            required: 'Nom requis',
                          })}
                          placeholder="Ex: Paracétamol"
                        />
                      </div>

                      <div>
                        <Label>Dosage *</Label>
                        <Input
                          {...register(`items.${index}.dosage`, {
                            required: 'Dosage requis',
                          })}
                          placeholder="Ex: 500mg"
                        />
                      </div>

                      <div>
                        <Label>Fréquence *</Label>
                        <Input
                          {...register(`items.${index}.frequency`, {
                            required: 'Fréquence requise',
                          })}
                          placeholder="Ex: 3 fois par jour"
                        />
                      </div>

                      <div>
                        <Label>Durée *</Label>
                        <Input
                          {...register(`items.${index}.duration`, {
                            required: 'Durée requise',
                          })}
                          placeholder="Ex: 7 jours"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Instructions spécifiques</Label>
                        <Textarea
                          {...register(`items.${index}.instructions`)}
                          placeholder="Ex: Prendre après les repas"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Conseils médicaux</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Recommandations générales, conseils..."
              rows={4}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer l\'ordonnance'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}