'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Stethoscope, Building, Clock, DollarSign, FileText } from 'lucide-react';
import { cliniqueApi } from '@/lib/api/clinique';
import { Clinique } from '@/types/clinique';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom doit contenir au moins 2 caractères.',
  }),
  description: z.string().min(10, {
    message: 'La description doit contenir au moins 10 caractères.',
  }),
  price: z.coerce.number().min(0, {
    message: 'Le prix doit être positif.',
  }),
  duration: z.coerce.number().min(1, {
    message: 'La durée doit être au moins 1 minute.',
  }),
  cliniqueId: z.string().min(1, {
    message: 'Veuillez sélectionner une clinique.',
  }),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MedicalServiceFormProps {
  initialData?: Partial<FormValues> & { id?: string };
  onSubmit: (values: FormValues) => Promise<void>;
  isEditing?: boolean;
}

export function MedicalServiceForm({
  initialData,
  onSubmit,
  isEditing = false,
}: MedicalServiceFormProps) {
  const [cliniques, setCliniques] = useState<Clinique[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCliniques, setLoadingCliniques] = useState(true);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      duration: initialData?.duration || 30,
      cliniqueId: initialData?.cliniqueId || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  useEffect(() => {
    loadCliniques();
  }, []);

  const loadCliniques = async () => {
    try {
      setLoadingCliniques(true);
      const data = await cliniqueApi.getAll();
      setCliniques(data);
    } catch (error) {
      console.error('Erreur lors du chargement des cliniques:', error);
    } finally {
      setLoadingCliniques(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  const selectedClinicId = form.watch('cliniqueId');
  const selectedClinic = cliniques.find(c => c.id === selectedClinicId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Modifier le Service Médical' : 'Nouveau Service Médical'}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {isEditing
                    ? 'Modifiez les informations du service médical existant'
                    : 'Créez un nouveau service médical pour votre clinique'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Colonne gauche */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>Nom du Service *</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Consultation générale, Radiologie, etc."
                              {...field}
                              disabled={loading}
                              className="border-gray-300 focus:border-blue-500 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>Description *</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description détaillée du service médical, procédures, etc."
                              className="min-h-[120px] border-gray-300 focus:border-blue-500 transition-colors"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cliniqueId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Building className="h-4 w-4 text-green-500" />
                            <span>Clinique *</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={loading || loadingCliniques}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-blue-500 transition-colors">
                                <SelectValue placeholder="Sélectionnez une clinique" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cliniques.map((clinique) => (
                                <SelectItem key={clinique.id} value={clinique.id}>
                                  <div className="flex items-center space-x-2">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span>{clinique.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedClinic && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-800">
                                <strong>Clinique sélectionnée :</strong> {selectedClinic.name}
                              </p>
                              {selectedClinic.address && (
                                <p className="text-xs text-blue-600 mt-1">{selectedClinic.address}</p>
                              )}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Colonne droite */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>Prix de consultation ($) *</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="50.00"
                                {...field}
                                disabled={loading}
                                className="border-gray-300 focus:border-blue-500 transition-colors pl-8"
                              />
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-gray-500">
                            Prix 
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>Durée (minutes) *</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="30"
                                {...field}
                                disabled={loading}
                                className="border-gray-300 focus:border-blue-500 transition-colors pl-8"
                              />
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-gray-500">
                            Durée estimée de la consultation en minutes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isEditing && (
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 bg-white">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-medium text-gray-700">
                                Service Actif
                              </FormLabel>
                              <FormDescription className="text-gray-500">
                                Activez ou désactivez la disponibilité de ce service
                              </FormDescription>
                            </div>
                            <FormControl>
                              <div className="flex items-center space-x-3">
                                <Badge 
                                  variant={field.value ? "default" : "secondary"}
                                  className={field.value 
                                    ? "bg-green-100 text-green-800 border-green-200" 
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                >
                                  {field.value ? 'Actif' : 'Inactif'}
                                </Badge>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={loading}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 min-w-24"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-32 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{isEditing ? 'Mise à jour...' : 'Création...'}</span>
                      </div>
                    ) : (
                      isEditing ? 'Mettre à jour' : 'Créer le service'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}