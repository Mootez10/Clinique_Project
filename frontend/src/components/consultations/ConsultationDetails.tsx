'use client';

import { Consultation } from '@/services/consultations.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, Stethoscope, Activity, FileText, Pill } from 'lucide-react';

interface ConsultationDetailsProps {
  consultation: Consultation;
}

export default function ConsultationDetails({ consultation }: ConsultationDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Consultation Médicale</CardTitle>
              <CardDescription>
                {formatDate(consultation.dateConsultation)}
              </CardDescription>
            </div>
            {getStatutBadge(consultation.statut)}
          </div>
        </CardHeader>
      </Card>

      {/* Informations Patient */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informations du Patient
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p className="font-medium">{consultation.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID Patient</p>
              <p className="font-medium">{consultation.patientId}</p>
            </div>
            {consultation.patientAge && (
              <div>
                <p className="text-sm text-muted-foreground">Âge</p>
                <p className="font-medium">{consultation.patientAge} ans</p>
              </div>
            )}
            {consultation.patientGender && (
              <div>
                <p className="text-sm text-muted-foreground">Sexe</p>
                <p className="font-medium">
                  {consultation.patientGender === 'M' && 'Homme'}
                  {consultation.patientGender === 'F' && 'Femme'}
                  {consultation.patientGender === 'Autre' && 'Autre'}
                </p>
              </div>
            )}
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-1">Motif de consultation</p>
            <p className="font-medium">{consultation.motif}</p>
          </div>
          {consultation.antecedents && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Antécédents médicaux</p>
                <p className="text-sm whitespace-pre-wrap">{consultation.antecedents}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Examen Clinique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Examen Clinique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {consultation.temperature && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Température</p>
                <p className="text-lg font-semibold">{consultation.temperature}°C</p>
              </div>
            )}
            {consultation.poids && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Poids</p>
                <p className="text-lg font-semibold">{consultation.poids} kg</p>
              </div>
            )}
            {consultation.taille && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Taille</p>
                <p className="text-lg font-semibold">{consultation.taille} cm</p>
              </div>
            )}
            {consultation.tensionArterielle && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Tension artérielle</p>
                <p className="text-lg font-semibold">{consultation.tensionArterielle}</p>
              </div>
            )}
            {consultation.frequenceCardiaque && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Fréquence cardiaque</p>
                <p className="text-lg font-semibold">{consultation.frequenceCardiaque} bpm</p>
              </div>
            )}
          </div>
          {consultation.symptomes && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium mb-2">Symptômes observés</p>
                <p className="text-sm whitespace-pre-wrap">{consultation.symptomes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Diagnostic et Traitement */}
      {(consultation.diagnostic || consultation.prescription || consultation.examensComplimentaires) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Stethoscope className="w-5 h-5 mr-2" />
              Diagnostic et Traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultation.diagnostic && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Diagnostic
                </p>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                  {consultation.diagnostic}
                </p>
              </div>
            )}
            {consultation.prescription && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center">
                  <Pill className="w-4 h-4 mr-2" />
                  Prescription
                </p>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                  {consultation.prescription}
                </p>
                </div>
            )}
            {consultation.examensComplimentaires && (
              <div>
                <p className="text-sm font-medium mb-2">Examens complémentaires</p>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                  {consultation.examensComplimentaires}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes et Informations Administratives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Informations Administratives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Médecin</p>
              <p className="font-medium">{consultation.medecinName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de consultation</p>
              <p className="font-medium">{formatDate(consultation.dateConsultation)}</p>
            </div>
          </div>
          {consultation.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Notes du médecin</p>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                  {consultation.notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}