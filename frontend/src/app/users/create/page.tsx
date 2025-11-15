'use client';

import { useRouter } from 'next/navigation';
import { CreateUserDto } from '@/lib/types';
import { useCreateUser } from '@/hooks/use-users';
import { UserForm } from '@/components/users/user-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function CreateUserPage() {
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserDto) => {
    try {
      setSubmitError(null);
      console.log('Création utilisateur avec données:', data);
      
      // Validation supplémentaire côté client
      if (data.phone && data.phone.length !== 8) {
        setSubmitError('Le numéro de téléphone doit contenir exactement 8 chiffres');
        return;
      }

      await createUserMutation.mutateAsync(data);
      toast.success('Utilisateur créé avec succès');
      router.push('/users');
    } catch (error: any) {
      console.error('Erreur création utilisateur:', error);
      setSubmitError(error.message || 'Erreur lors de la création');
      toast.error(`Erreur lors de la création: ${error.message || 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/users">
            <Button variant="ghost" className="rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Créer un utilisateur</h1>
              <p className="text-sm text-gray-600">Ajoutez un nouvel utilisateur au système</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}
          
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Informations de l'utilisateur
              </CardTitle>
              <CardDescription className="text-gray-600">
                Remplissez les informations requises pour créer un nouveau compte utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <UserForm
                onSubmit={handleSubmit}
                isLoading={createUserMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}