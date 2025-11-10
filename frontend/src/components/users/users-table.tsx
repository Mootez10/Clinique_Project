'use client';

import { User, UserRole } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface UsersTableProps {
  users: User[];
  onDelete: (id: string, role: UserRole) => void;
  isDeleting?: boolean;
}

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.RECEP]: 'Réceptionniste',
  [UserRole.DOCTOR]: 'Docteur',
  [UserRole.PATIENT]: 'Patient',
};

const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'bg-blue-500',
  [UserRole.SUPER_ADMIN]: 'bg-purple-500',
  [UserRole.RECEP]: 'bg-green-500',
  [UserRole.DOCTOR]: 'bg-orange-500',
  [UserRole.PATIENT]: 'bg-gray-500',
};

export function UsersTable({ users, onDelete, isDeleting }: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || '-'}</TableCell>
              <TableCell>
                <Badge className={roleColors[user.role]}>
                  {roleLabels[user.role]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/users/${user.id}?role=${user.role}`}>
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                  </Link>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(user.id, user.role)}
                    disabled={isDeleting}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}