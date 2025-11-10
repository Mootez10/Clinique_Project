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

export default function CreateUserPage() {
  const router = useRouter();
  const createUserMutation = useCreateUser();

  const handleSubmit = async (data: CreateUserDto) => {
    try {
      console.log('Submitting user data:', data);
      await createUserMutation.mutateAsync(data);
      toast.success('Utilisateur créé avec succès');
      router.push('/users');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error(`Erreur lors de la création: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/users">
          <Button variant="outline">← Retour</Button>
        </Link>
        <h1 className="text-3xl font-bold">Créer un utilisateur</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nouvel utilisateur</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un nouvel utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            onSubmit={handleSubmit}
            isLoading={createUserMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}