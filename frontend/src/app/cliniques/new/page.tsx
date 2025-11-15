'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Building, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { cliniqueApi } from '@/lib/api/clinique';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  phone: z.string().regex(/^\+?216[0-9]{8}$/, 'Numéro de téléphone tunisien invalide (ex: +21612345678)'),
  email: z.string().email('Email invalide'),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewCliniquePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await cliniqueApi.create(data);
      toast({
        title: 'Succès',
        description: 'Clinique créée avec succès',
      });
      router.push('/cliniques');
      router.refresh();
    } catch (error: any) {
      console.error('Erreur création clinique:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de créer la clinique',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/cliniques')}
            className="rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux cliniques
          </Button>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouvelle Clinique</h1>
              <p className="text-sm text-gray-600">Ajoutez une nouvelle clinique à votre réseau</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Informations de la Clinique
              </CardTitle>
              <CardDescription className="text-gray-600">
                Remplissez les informations requises pour créer une nouvelle clinique
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Colonne gauche */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span>Nom de la clinique *</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Clinique Internationale" 
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-green-500" />
                              <span>Téléphone *</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Ex: +21612345678" 
                                  {...field} 
                                  disabled={loading}
                                  className="border-gray-300 focus:border-blue-500 transition-colors pl-8"
                                />
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Colonne droite */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-orange-500" />
                              <span>Adresse *</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Ex: Avenue Habib Bourguiba, Tunis" 
                                  {...field} 
                                  disabled={loading}
                                  className="border-gray-300 focus:border-blue-500 transition-colors pl-8"
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-purple-500" />
                              <span>Email *</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="email" 
                                  placeholder="Ex: contact@clinique.tn" 
                                  {...field} 
                                  disabled={loading}
                                  className="border-gray-300 focus:border-blue-500 transition-colors pl-8"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Conseils de création</h4>
                        <ul className="text-xs text-blue-600 mt-1 space-y-1">
                          <li>• Utilisez un nom clair et identifiable pour la clinique</li>
                          <li>• Vérifiez que le numéro de téléphone suit le format tunisien</li>
                          <li>• L'adresse doit être complète pour faciliter la localisation</li>
                          <li>• L'email sera utilisé pour les communications officielles</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/cliniques')}
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
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Création...</span>
                        </div>
                      ) : (
                        'Créer la clinique'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}