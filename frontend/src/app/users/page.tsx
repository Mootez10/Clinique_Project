'use client';

import { useState } from 'react';
import { UserRole } from '@/lib/types';
import { useUsers, useDeleteUser } from '@/hooks/use-users';
import { UsersTable } from '@/components/users/users-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import router from 'next/router';
import { Building } from 'lucide-react';

type RoleFilter = UserRole | 'ALL';

export default function UsersPage() {
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('ALL');
  const { data: users = [], isLoading, error } = useUsers(selectedRole === 'ALL' ? undefined : selectedRole);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = async (id: string, role: UserRole) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUserMutation.mutateAsync({ id, role });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const roleOptions = [
    { value: 'ALL', label: 'Tous les rôles' },
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.RECEP, label: 'Réceptionniste' },
    { value: UserRole.DOCTOR, label: 'Docteur' },
    { value: UserRole.PATIENT, label: 'Patient' },
  ];

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Erreur lors du chargement des utilisateurs</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <Link href="/users/create">
          <Button>Créer un utilisateur</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez tous les utilisateurs de votre application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select
              value={selectedRole}
              onValueChange={(value: RoleFilter) => setSelectedRole(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p>Chargement...</p>
          ) : (
            <UsersTable
              users={users}
              onDelete={handleDeleteUser}
              isDeleting={deleteUserMutation.isPending}
            />
          )}
        </CardContent>
      </Card>

     <Link href="/dashboard-admin">
            <Button variant="outline">
              📊 Retour au dashboard Admin
            </Button>
          </Link>


    </div>
    
  );
}