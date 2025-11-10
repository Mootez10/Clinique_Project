import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, CreateUserDto, UserRole} from '@/lib/types';
import { apiService } from '@/lib/apiusers'; 

export const useUsers = (role?: UserRole) => {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => apiService.getUsers(role),
  });
};

export const useUser = (id: string, role: UserRole) => {
  return useQuery({
    queryKey: ['user', id, role],
    queryFn: () => apiService.getUserById(id, role),
    enabled: !!id && !!role,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => {
      // Validation avant l'envoi
      if (!userData.role) {
        throw new Error('Le rôle est requis');
      }
      return apiService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      console.error('Error creating user:', error);
    },
  });
};



export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      apiService.deleteUser(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};