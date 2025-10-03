"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Stethoscope,
  Calendar,
  User,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  Pill,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Clock,
  UserCheck,
  ClipboardList,
  
} from "lucide-react";

export default function NewConsultationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    consultationDate: "",
    consultationTime: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    symptoms: "",
    diagnostic: "",
    notes: "",
    prescription: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    alert("Consultation sauvegardée !");
    router.push("/consultations");
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/consultations")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux consultations
              </Button>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">Nouvelle Consultation</h1>
                  <p className="text-sm text-slate-500">Création d'un nouveau dossier médical</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Sidebar - Informations patient */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  Informations Patient
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Patient</Label>
                  <Select onValueChange={(v) => handleChange("patientName", v)}>
                    <SelectTrigger className="bg-white border-slate-300 rounded-lg">
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alice Dupont">molka hamdi - 24 ans</SelectItem>
                      <SelectItem value="Mohamed Salah">Mootez aounti- 25ans</SelectItem>
                      <SelectItem value="Yasmine Ben Ali">chayma- 24 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Âge</Label>
                  <Input
                    placeholder="Âge du patient"
                    value={formData.patientAge}
                    onChange={(e) => handleChange("patientAge", e.target.value)}
                    className="bg-white border-slate-300 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Date</Label>
                  <Input
                    type="date"
                    value={formData.consultationDate}
                    onChange={(e) => handleChange("consultationDate", e.target.value)}
                    className="bg-white border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Heure</Label>
                  <Input
                    type="time"
                    value={formData.consultationTime}
                    onChange={(e) => handleChange("consultationTime", e.target.value)}
                    className="bg-white border-slate-300 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  Constantes Vitales
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
               
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Température</Label>
                    <Input 
                      placeholder="37.2°C" 
                      value={formData.temperature} 
                      onChange={(e) => handleChange("temperature", e.target.value)}
                      className="bg-white border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Poids</Label>
                    <Input 
                      placeholder="68 kg" 
                      value={formData.weight} 
                      onChange={(e) => handleChange("weight", e.target.value)}
                      className="bg-white border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Taille</Label>
                  <Input 
                    placeholder="175 cm" 
                    value={formData.height} 
                    onChange={(e) => handleChange("height", e.target.value)}
                    className="bg-white border-slate-300 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content - Consultation */}
          <div className="xl:col-span-3 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm rounded-xl lg:col-span-2">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ClipboardList className="h-4 w-4 text-blue-600" />
                    </div>
                    Examen Clinique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Symptômes rapportés</Label>
                    <Textarea 
                      placeholder="Décrire les symptômes présentés par le patient..."
                      rows={4} 
                      value={formData.symptoms} 
                      onChange={(e) => handleChange("symptoms", e.target.value)}
                      className="bg-white border-slate-300 rounded-lg resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Observations cliniques</Label>
                    <Textarea 
                      placeholder="Notes d'examen physique, observations..."
                      rows={3} 
                      value={formData.notes} 
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="bg-white border-slate-300 rounded-lg resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    Diagnostic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Diagnostic principal</Label>
                    <Textarea 
                      placeholder="Établir le diagnostic..."
                      rows={4} 
                      value={formData.diagnostic} 
                      onChange={(e) => handleChange("diagnostic", e.target.value)}
                      className="bg-white border-slate-300 rounded-lg resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                    <div className="p-2 bg-blue-50 rounded-lg">
                  
                    </div>
                    Traitement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Prescription médicale</Label>
                    <Textarea 
                      placeholder="Médicaments, posologie, durée..."
                      rows={4} 
                      value={formData.prescription} 
                      onChange={(e) => handleChange("prescription", e.target.value)}
                      className="bg-white border-slate-300 rounded-lg resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-800 text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="border-slate-300 text-slate-700 rounded-lg">
                    <FileText className="h-4 w-4 mr-2" />
                    Ordonnance type
                  </Button>
              
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer actions */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              Consultation en cours • Dernière modification: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg min-w-[140px]"
              >
                Brouillon
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg min-w-[180px] shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Finaliser la consultation
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}