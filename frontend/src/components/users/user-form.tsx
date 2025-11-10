'use client';

import { useForm } from 'react-hook-form';
import { CreateUserDto, UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface UserFormProps {
  onSubmit: (data: CreateUserDto) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateUserDto>;
  isEdit?: boolean;
}

export function UserForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  isEdit = false 
}: UserFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserDto>({
    defaultValues: initialData,
  });

  // S'assurer que le rôle est défini
  useEffect(() => {
    if (initialData?.role) {
      setSelectedRole(initialData.role);
      setValue('role', initialData.role);
    }
  }, [initialData, setValue]);

  const roleOptions = [
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.RECEP, label: 'Réceptionniste' },
    { value: UserRole.DOCTOR, label: 'Docteur' },
    { value: UserRole.PATIENT, label: 'Patient' },
  ];

  const handleRoleChange = (value: UserRole) => {
    setSelectedRole(value);
    setValue('role', value);
  };

  const handleFormSubmit = (data: any) => {
    // Validation supplémentaire pour s'assurer que le rôle est défini
    if (!data.role) {
      alert('Veuillez sélectionner un rôle');
      return;
    }
    onSubmit(data as CreateUserDto);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Prénom"
            {...register('firstName', { required: 'Le prénom est requis' })}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Nom"
            {...register('lastName', { required: 'Le nom est requis' })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'L\'email est requis',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Email invalide',
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Téléphone"
          {...register('phone')}
        />
      </div>

      <div>
        <Input
          type="password"
          placeholder={isEdit ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
          {...register('password', {
            required: isEdit ? false : 'Le mot de passe est requis',
            minLength: {
              value: 6,
              message: 'Le mot de passe doit contenir au moins 6 caractères',
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Select 
          onValueChange={handleRoleChange} 
          value={selectedRole}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!selectedRole && (
          <p className="text-red-500 text-sm mt-1">Le rôle est requis</p>
        )}
      </div>

      {/* Champ pour la clinique si docteur ou réceptionniste */}
      {(selectedRole === UserRole.DOCTOR || selectedRole === UserRole.RECEP) && (
        <div>
          <Input
            placeholder="ID de la clinique (optionnel)"
            {...register('cliniqueId')}
          />
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isLoading || !selectedRole} 
        className="w-full"
      >
        {isLoading 
          ? (isEdit ? 'Mise à jour...' : 'Création...') 
          : (isEdit ? 'Mettre à jour' : 'Créer l\'utilisateur')
        }
      </Button>
    </form>
  );
}