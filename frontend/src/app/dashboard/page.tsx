// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Mail, Phone, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return 'destructive';
      case 'doctor':
        return 'default';
      case 'receptionist':
        return 'secondary';
      case 'patient':
        return 'outline';
      default:
        return 'default';
    }
  };

  const formatRole = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'super_admin': 'Super Administrateur',
      'admin': 'Administrateur',
      'doctor': 'Médecin',
      'receptionist': 'Réceptionniste',
      'patient': 'Patient',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Bienvenue, {user.firstName} {user.lastName}!</CardTitle>
              <CardDescription>
                Voici les informations de votre profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <Badge variant={getRoleBadgeVariant(user.role) as any}>
                    {formatRole(user.role)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="h-5 w-5" />
                  <span>ID: {user.id}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>
                    Créé le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Gérez votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Modifier le profil
              </Button>
              <Button className="w-full" variant="outline">
                Changer le mot de passe
              </Button>
              <Button className="w-full" variant="outline">
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Prénom</p>
                <p className="font-medium">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{user.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rôle</p>
                <p className="font-medium">{formatRole(user.role)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dernière mise à jour</p>
                <p className="font-medium">
                  {new Date(user.updatedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}