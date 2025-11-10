// frontend/app/cliniques/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
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
import { useToast } from '../../../hooks/use-toast';

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
      // Redirection vers la liste des cliniques après création
      router.push('/cliniques');
      router.refresh(); // Forcer le rafraîchissement des données
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
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        onClick={() => router.push('/cliniques')} // Rediriger vers la liste plutôt que "back"
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nouvelle Clinique</CardTitle>
          <CardDescription>
            Créez une nouvelle clinique dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la clinique *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Clinique Internationale" 
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Avenue Habib Bourguiba, Tunis" 
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: +21612345678" 
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Ex: contact@clinique.tn" 
                        {...field} 
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/cliniques')}
                  disabled={loading}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1"
                >
                  {loading ? 'Création...' : 'Créer la clinique'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}