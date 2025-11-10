// frontend/app/cliniques/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, MapPin, Phone, Mail, Users, Stethoscope } from 'lucide-react';
import { cliniqueApi } from '@/lib/api/clinique';
import { Clinique } from '@/types/clinique';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '../../../hooks/use-toast';

export default function CliniqueDetailPage() {
  const [clinique, setClinique] = useState<Clinique | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  useEffect(() => {
    loadClinique();
  }, [id]);

  const loadClinique = async () => {
    try {
      setLoading(true);
      const data = await cliniqueApi.getOne(id);
      setClinique(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger la clinique',
      });
      router.push('/cliniques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!clinique) return null;

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="grid gap-6">
        {/* Main Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">{clinique.name}</CardTitle>
                <CardDescription>
                  Informations de la clinique
                </CardDescription>
              </div>
              <Button onClick={() => router.push(`/cliniques/${id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">{clinique.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">{clinique.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{clinique.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Doctors Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  <CardTitle>Médecins</CardTitle>
                </div>
                <Badge variant="secondary">
                  {clinique.doctors?.length || 0}
                </Badge>
              </div>
              <CardDescription>
                Liste des médecins assignés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clinique.doctors && clinique.doctors.length > 0 ? (
                <div className="space-y-3">
                  {clinique.doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <p className="font-medium">
                        {doctor.firstName || 'Dr.'} {doctor.lastName || doctor.email}
                      </p>
                      <p className="text-sm text-muted-foreground">{doctor.email}</p>
                      {doctor.specialization && (
                        <Badge variant="outline" className="mt-2">
                          {doctor.specialization}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun médecin assigné
                </p>
              )}
            </CardContent>
          </Card>

          {/* Receptionists Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Réceptionnistes</CardTitle>
                </div>
                <Badge variant="secondary">
                  {clinique.receptionists?.length || 0}
                </Badge>
              </div>
              <CardDescription>
                Liste des réceptionnistes assignés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clinique.receptionists && clinique.receptionists.length > 0 ? (
                <div className="space-y-3">
                  {clinique.receptionists.map((recep) => (
                    <div
                      key={recep.id}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <p className="font-medium">
                        {recep.firstName || ''} {recep.lastName || recep.email}
                      </p>
                      <p className="text-sm text-muted-foreground">{recep.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun réceptionniste assigné
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assign Users Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={() => router.push(`/cliniques/${id}/assign-users`)}
              className="w-full"
              variant="outline"
            >
              <Users className="mr-2 h-4 w-4" />
              Assigner des utilisateurs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}