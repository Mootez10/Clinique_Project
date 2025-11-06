'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { consultationsApi, Consultation } from '@/services/consultations.service';
import { useToast } from '@/components/ui/use-toast';

interface ConsultationFormProps {
  consultation?: Consultation; 
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ConsultationForm({ consultation, onSuccess, onCancel }: ConsultationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: consultation?.patientId || '',
    patientName: consultation?.patientName || '',
    patientAge: consultation?.patientAge || '',
    patientGender: consultation?.patientGender || '',
    motif: consultation?.motif || '',
    antecedents: consultation?.antecedents || '',
    temperature: consultation?.temperature || '',
    poids: consultation?.poids || '',
    taille: consultation?.taille || '',
    tensionArterielle: consultation?.tensionArterielle || '',
    frequenceCardiaque: consultation?.frequenceCardiaque || '',
    symptomes: consultation?.symptomes || '',
    diagnostic: consultation?.diagnostic || '',
    prescription: consultation?.prescription || '',
    examensComplimentaires: consultation?.examensComplimentaires || '',
    notes: consultation?.notes || '',
    medecinId: consultation?.medecinId || 'MED001',
    medecinName: consultation?.medecinName || 'Dr. Exemple',
    dateConsultation: consultation?.dateConsultation || new Date().toISOString().split('T')[0],
    statut: consultation?.statut || 'en_cours',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convertir les chaînes vides en null pour les champs numériques
      const dataToSend = {
        ...formData,
        patientAge: formData.patientAge ? Number(formData.patientAge) : undefined,
        temperature: formData.temperature ? Number(formData.temperature) : undefined,
        poids: formData.poids ? Number(formData.poids) : undefined,
        taille: formData.taille ? Number(formData.taille) : undefined,
        frequenceCardiaque: formData.frequenceCardiaque ? Number(formData.frequenceCardiaque) : undefined,
      };

      if (consultation?.id) {
        await consultationsApi.update(consultation.id, dataToSend);
        toast({
          title: 'Consultation mise à jour',
          description: 'La consultation a été mise à jour avec succès.',
        });
      } else {
        await consultationsApi.create(dataToSend as any);
        toast({
          title: 'Consultation créée',
          description: 'La consultation a été créée avec succès.',
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="examen">Examen</TabsTrigger>
          <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* ONGLET 1 : INFORMATIONS PATIENT */}
        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Patient</CardTitle>
              <CardDescription>Saisissez les informations de base du patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">ID Patient *</Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    placeholder="PAT001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientName">Nom Complet *</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientAge">Âge</Label>
                  <Input
                    id="patientAge"
                    name="patientAge"
                    type="number"
                    value={formData.patientAge}
                    onChange={handleChange}
                    placeholder="35"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientGender">Sexe</Label>
                  <Select
                    value={formData.patientGender}
                    onValueChange={(value) => handleSelectChange('patientGender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Homme</SelectItem>
                      <SelectItem value="F">Femme</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motif">Motif de Consultation *</Label>
                <Textarea
                  id="motif"
                  name="motif"
                  value={formData.motif}
                  onChange={handleChange}
                  placeholder="Décrivez la raison de la visite..."
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="antecedents">Antécédents Médicaux</Label>
                <Textarea
                  id="antecedents"
                  name="antecedents"
                  value={formData.antecedents}
                  onChange={handleChange}
                  placeholder="Historique médical, allergies, traitements en cours..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ONGLET 2 : EXAMEN CLINIQUE */}
        <TabsContent value="examen">
          <Card>
            <CardHeader>
              <CardTitle>Examen Clinique</CardTitle>
              <CardDescription>Signes vitaux et symptômes observés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Température (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="37.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poids">Poids (kg)</Label>
                  <Input
                    id="poids"
                    name="poids"
                    type="number"
                    step="0.1"
                    value={formData.poids}
                    onChange={handleChange}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taille">Taille (cm)</Label>
                  <Input
                    id="taille"
                    name="taille"
                    type="number"
                    value={formData.taille}
                    onChange={handleChange}
                    placeholder="175"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tensionArterielle">Tension Artérielle</Label>
                  <Input
                    id="tensionArterielle"
                    name="tensionArterielle"
                    value={formData.tensionArterielle}
                    onChange={handleChange}
                    placeholder="120/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequenceCardiaque">Fréquence Cardiaque (bpm)</Label>
                  <Input
                    id="frequenceCardiaque"
                    name="frequenceCardiaque"
                    type="number"
                    value={formData.frequenceCardiaque}
                    onChange={handleChange}
                    placeholder="72"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptomes">Symptômes</Label>
                <Textarea
                  id="symptomes"
                  name="symptomes"
                  value={formData.symptomes}
                  onChange={handleChange}
                  placeholder="Décrivez les symptômes observés..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ONGLET 3 : DIAGNOSTIC & TRAITEMENT */}
        <TabsContent value="diagnostic">
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic et Traitement</CardTitle>
              <CardDescription>Conclusions et prescriptions médicales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnostic">Diagnostic</Label>
                <Textarea
                  id="diagnostic"
                  name="diagnostic"
                  value={formData.diagnostic}
                  onChange={handleChange}
                  placeholder="Diagnostic médical..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescription">Prescription</Label>
                <Textarea
                  id="prescription"
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  placeholder="Médicaments prescrits (nom, dosage, durée)..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examensComplimentaires">Examens Complémentaires</Label>
                <Textarea
                  id="examensComplimentaires"
                  name="examensComplimentaires"
                  value={formData.examensComplimentaires}
                  onChange={handleChange}
                  placeholder="Analyses de sang, radiographies, etc..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ONGLET 4 : NOTES & INFOS ADMIN */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes et Informations Administratives</CardTitle>
              <CardDescription>Notes supplémentaires et détails de la consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes du Médecin</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Notes supplémentaires, observations particulières..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medecinName">Médecin</Label>
                  <Input
                    id="medecinName"
                    name="medecinName"
                    value={formData.medecinName}
                    onChange={handleChange}
                    placeholder="Dr. Nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateConsultation">Date de Consultation *</Label>
                  <Input
                    id="dateConsultation"
                    name="dateConsultation"
                    type="date"
                    value={formData.dateConsultation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleSelectChange('statut', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                    <SelectItem value="annulee">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* BOUTONS D'ACTION */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : consultation ? 'Mettre à jour' : 'Créer la consultation'}
        </Button>
      </div>
    </form>
  );
}