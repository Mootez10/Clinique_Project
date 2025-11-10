// frontend/app/cliniques/[id]/assign-users/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cliniqueApi } from '@/lib/api/clinique';
import { UserRole } from '@/types/clinique';
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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '../../../../hooks/use-toast';

// Interface pour les utilisateurs
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export default function AssignUsersPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole.DOCTOR | UserRole.RECEP>(UserRole.DOCTOR);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  useEffect(() => {
    loadUsers();
  }, [selectedRole]);

  const loadUsers = async () => {
    try {
      // TODO: Remplacer par un vrai appel API
      // const response = await fetch(`${API_URL}/users?role=${selectedRole}`);
      // const data = await response.json();
      // setUsers(data);
      
      // Données mockées pour démonstration
      const mockUsers: User[] = [
        { id: '1', email: 'doctor1@example.com', firstName: 'Dr. Ahmed', lastName: 'Ben Salem', role: UserRole.DOCTOR },
        { id: '2', email: 'doctor2@example.com', firstName: 'Dr. Fatma', lastName: 'Khaled', role: UserRole.DOCTOR },
        { id: '3', email: 'doctor3@example.com', firstName: 'Dr. Mohamed', lastName: 'Jebali', role: UserRole.DOCTOR },
        { id: '4', email: 'recep1@example.com', firstName: 'Sara', lastName: 'Mansour', role: UserRole.RECEP },
        { id: '5', email: 'recep2@example.com', firstName: 'Amina', lastName: 'Trabelsi', role: UserRole.RECEP },
        { id: '6', email: 'recep3@example.com', firstName: 'Leila', lastName: 'Bouazizi', role: UserRole.RECEP },
      ];
      
      setUsers(mockUsers.filter(u => u.role === selectedRole));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger les utilisateurs',
      });
    }
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (selectedUserIds.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner au moins un utilisateur',
      });
      return;
    }

    try {
      setLoading(true);
      await cliniqueApi.assignUsers({
        cliniqueId: id,
        role: selectedRole,
        userIds: selectedUserIds,
      });
      toast({
        title: 'Succès',
        description: 'Utilisateurs assignés avec succès',
      });
      router.push(`/cliniques/${id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible d\'assigner les utilisateurs',
      });
    } finally {
      setLoading(false);
    }
  };

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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Assigner des Utilisateurs</CardTitle>
          <CardDescription>
            Sélectionnez le rôle et les utilisateurs à assigner à cette clinique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Type d'utilisateur</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => {
                setSelectedRole(value as UserRole.DOCTOR | UserRole.RECEP);
                setSelectedUserIds([]);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.DOCTOR}>Médecins</SelectItem>
                <SelectItem value={UserRole.RECEP}>Réceptionnistes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Sélectionner les {selectedRole === UserRole.DOCTOR ? 'médecins' : 'réceptionnistes'}
            </Label>
            <div className="border rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun utilisateur disponible
                </p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={user.id}
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <label
                      htmlFor={user.id}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </label>
                  </div>
                ))
              )}
            </div>
            {selectedUserIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedUserIds.length} utilisateur(s) sélectionné(s)
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || selectedUserIds.length === 0}
              className="flex-1"
            >
              {loading ? 'Assignment...' : 'Assigner'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}