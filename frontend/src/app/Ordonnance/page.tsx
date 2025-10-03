"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  Stethoscope,
  Plus,
  Trash2,
  Printer,
  Calendar,
  MapPin,
  Phone,
  Pill,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Shield,
  Heart,
  Activity,
  Eye
} from "lucide-react";

type Patient = {
  name: string;
  age: string;
  phone: string;
  address: string;
};

type Doctor = {
  name: string;
  specialty: string;
  phone: string;
  address: string;
  rpps: string;
};

type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type Prescription = {
  id: string;
  patient: Patient;
  doctor: Doctor;
  medications: Medication[];
  date: string;
  diagnosis: string;
  notes: string;
};

export default function PrescriptionManagementPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const printRef = useRef<HTMLDivElement>(null);

  // Créer une nouvelle ordonnance vide
  const createNewPrescription = () => {
    const newPrescription: Prescription = {
      id: `RX-${Date.now()}`,
      patient: { name: "", age: "", phone: "", address: "" },
      doctor: {
        name: "Dr. Ahmed Ben Salah",
        specialty: "Médecin Généraliste",
        phone: "71 234 567",
        address: "45 Avenue Habib Bourguiba, Tunis",
        rpps: "12345678901"
      },
      medications: [{
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
      }],
      date: new Date().toISOString().split('T')[0],
      diagnosis: "",
      notes: ""
    };
    setCurrentPrescription(newPrescription);
    setViewMode("form");
  };

  // Sauvegarder l'ordonnance
  const savePrescription = () => {
    if (!currentPrescription) return;

    const updatedPrescriptions = prescriptions.filter(p => p.id !== currentPrescription.id);
    setPrescriptions([...updatedPrescriptions, currentPrescription]);
    setCurrentPrescription(null);
    setViewMode("list");
  };

  // Charger une ordonnance existante
  const loadPrescription = (prescription: Prescription) => {
    setCurrentPrescription(prescription);
    setViewMode("form");
  };

  // Gestion des médicaments
  const addMedication = () => {
    if (!currentPrescription) return;
    
    setCurrentPrescription({
      ...currentPrescription,
      medications: [
        ...currentPrescription.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
      ]
    });
  };

  const removeMedication = (index: number) => {
    if (!currentPrescription) return;
    
    setCurrentPrescription({
      ...currentPrescription,
      medications: currentPrescription.medications.filter((_, i) => i !== index)
    });
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    if (!currentPrescription) return;
    
    const updated = [...currentPrescription.medications];
    updated[index] = { ...updated[index], [field]: value };
    
    setCurrentPrescription({
      ...currentPrescription,
      medications: updated
    });
  };

  // Fonction d'impression professionnelle
  const printPrescription = (prescription: Prescription) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ordonnance Médicale</title>
          <meta charset="UTF-8">
          <style>
            @media print {
              @page { margin: 1.5cm; size: A4; }
              body { font-family: 'Times New Roman', serif; color: #000; font-size: 14px; }
            }
            body { 
              font-family: 'Times New Roman', serif; 
              color: #000; 
              max-width: 21cm; 
              margin: 0 auto; 
              padding: 2cm;
              background: white;
              font-size: 14px;
              line-height: 1.4;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 1.5cm; 
              border-bottom: 3px double #000; 
              padding-bottom: 0.8cm;
            }
            .doctor-info { flex: 1; }
            .patient-info { 
              margin: 1cm 0; 
              padding: 0.5cm;
              border: 1px solid #000;
            }
            .medication-item { 
              margin: 0.5cm 0; 
              padding: 0.3cm 0;
              border-bottom: 1px solid #ddd;
            }
            .signature-area {
              margin-top: 2cm;
              text-align: right;
            }
            .footer {
              margin-top: 1.5cm;
              padding-top: 0.5cm;
              border-top: 1px solid #000;
              text-align: center;
              font-size: 12px;
            }
            .watermark {
              position: fixed;
              bottom: 3cm;
              right: 2cm;
              opacity: 0.05;
              font-size: 6em;
              transform: rotate(-45deg);
              pointer-events: none;
              font-weight: bold;
            }
            .diagnosis {
              background: #f5f5f5;
              padding: 0.5cm;
              margin: 0.5cm 0;
              border-left: 4px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="doctor-info">
              <h1 style="margin: 0; font-size: 18px; font-weight: bold;">CABINET MÉDICAL</h1>
              <p style="margin: 0.2cm 0; font-weight: bold;">${prescription.doctor.name}</p>
              <p style="margin: 0.1cm 0;">${prescription.doctor.specialty}</p>
              <p style="margin: 0.1cm 0; font-size: 12px;">
                ${prescription.doctor.address}<br>
                Tél: ${prescription.doctor.phone} • RPPS: ${prescription.doctor.rpps}
              </p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 16px; font-weight: bold;">ORDONNANCE</h2>
              <p style="margin: 0.2cm 0; font-size: 12px;">${new Date(prescription.date).toLocaleDateString('fr-FR')}</p>
              <p style="margin: 0.1cm 0; font-size: 11px; font-style: italic;">Valable 3 mois</p>
            </div>
          </div>

          <div class="patient-info">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 30%; font-weight: bold;">PATIENT:</td>
                <td style="width: 70%;">${prescription.patient.name || "________________"}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">ÂGE:</td>
                <td>${prescription.patient.age || "______"}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">ADRESSE:</td>
                <td>${prescription.patient.address || "____________________________"}</td>
              </tr>
            </table>
          </div>

          ${prescription.diagnosis ? `
            <div class="diagnosis">
              <strong>DIAGNOSTIC:</strong> ${prescription.diagnosis}
            </div>
          ` : ''}

          <div style="margin: 1cm 0;">
            <h3 style="font-size: 14px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 0.2cm;">
              PRESCRIPTION MÉDICALE
            </h3>
            
            ${prescription.medications.filter(m => m.name.trim() !== '').map(med => `
              <div class="medication-item">
                <p style="margin: 0.2cm 0; font-weight: bold;">${med.name}</p>
                <table style="width: 100%; font-size: 13px;">
                  <tr>
                    <td style="width: 30%;"><strong>Posologie:</strong></td>
                    <td>${med.dosage || '_________'}</td>
                  </tr>
                  <tr>
                    <td><strong>Fréquence:</strong></td>
                    <td>${med.frequency || '_________'}</td>
                  </tr>
                  <tr>
                    <td><strong>Durée:</strong></td>
                    <td>${med.duration || '_________'}</td>
                  </tr>
                  ${med.instructions ? `
                    <tr>
                      <td><strong>Instructions:</strong></td>
                      <td>${med.instructions}</td>
                    </tr>
                  ` : ''}
                </table>
              </div>
            `).join('')}

            ${prescription.medications.filter(m => m.name.trim() !== '').length === 0 ? `
              <div style="text-align: center; color: #999; padding: 1cm; font-style: italic;">
                Aucun médicament prescrit
              </div>
            ` : ''}
          </div>

          ${prescription.notes ? `
            <div style="margin: 1cm 0; padding: 0.3cm; border: 1px dashed #000;">
              <strong>OBSERVATIONS:</strong> ${prescription.notes}
            </div>
          ` : ''}

          <div class="signature-area">
            <p style="margin: 0.5cm 0;">
              Fait à Tunis, le ${new Date(prescription.date).toLocaleDateString('fr-FR')}
            </p>
            <div style="margin-top: 1.5cm;">
              <div style="display: inline-block; text-align: center;">
                <div style="border-top: 1px solid #000; width: 8cm; margin-bottom: 0.2cm;"></div>
                <p style="margin: 0; font-size: 12px;">Signature et cachet du médecin</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Ordonnance établie électroniquement • Non valable pour les stupéfiants</p>
            <p>En cas d'urgence: 190 • Conservation: 3 ans</p>
          </div>

          <div class="watermark">
            ORDONNANCE
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Filtrer les ordonnances
  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-700 rounded-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Gestion des Ordonnances</h1>
                <p className="text-slate-600 font-medium">Système médical de prescription</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700 font-medium">
                  {prescriptions.length} ordonnance(s) enregistrée(s)
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === "list" ? (
          // Vue Liste des Ordonnances
          <div className="space-y-6">
            {/* Statistiques et Recherche */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Ordonnances Actives</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">{prescriptions.length}</p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Médicaments Prescrits</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">
                        {prescriptions.reduce((total, p) => total + p.medications.filter(m => m.name).length, 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm rounded-lg lg:col-span-2">
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Rechercher par patient ou diagnostic..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-gray-300 rounded-lg h-12"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des Ordonnances */}
            <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-xl">
                  <FileText className="h-6 w-6 text-slate-600" />
                  Dossier des Ordonnances
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredPrescriptions.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                      {prescriptions.length === 0 ? "Aucune ordonnance créée" : "Aucun résultat trouvé"}
                    </h3>
                    <p className="text-slate-500 mb-6">
                      {prescriptions.length === 0 
                        ? "Commencez par créer votre première ordonnance médicale"
                        : "Essayez de modifier vos critères de recherche"
                      }
                    </p>
                    <Button 
                      onClick={createNewPrescription}
                      className="bg-slate-700 hover:bg-slate-800 text-white rounded-lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Créer une Ordonnance
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredPrescriptions.map((prescription) => (
                      <div 
                        key={prescription.id}
                        className="p-6 hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
                        onClick={() => loadPrescription(prescription)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-slate-100 p-2 rounded-lg">
                                <User className="h-5 w-5 text-slate-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800 text-lg">
                                  {prescription.patient.name || "Patient non renseigné"}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(prescription.date).toLocaleDateString('fr-FR')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Pill className="h-4 w-4" />
                                    {prescription.medications.filter(m => m.name).length} médicament(s)
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {prescription.diagnosis && (
                              <div className="flex items-start gap-2 mb-2">
                                <Activity className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                                <p className="text-slate-700"><strong>Diagnostic:</strong> {prescription.diagnosis}</p>
                              </div>
                            )}
                            
                            {prescription.notes && (
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                                <p className="text-slate-600 text-sm">{prescription.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                printPrescription(prescription);
                              }}
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              Imprimer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                loadPrescription(prescription);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Vue Formulaire de Création/Édition
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="xl:col-span-2 space-y-6">
              {/* En-tête */}
              <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {currentPrescription?.id ? 'Modifier l\'ordonnance' : 'Nouvelle Ordonnance'}
                      </h2>
                      <p className="text-slate-600">Remplissez les informations médicales</p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-sm font-medium">
                      {currentPrescription?.id || 'RX-' + Date.now().toString().slice(-6)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Informations Patient */}
              <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-4 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <User className="h-5 w-5 text-slate-600" />
                    Informations Patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">Nom complet du patient</Label>
                      <Input
                        value={currentPrescription?.patient.name || ""}
                        onChange={(e) => setCurrentPrescription(currentPrescription ? {
                          ...currentPrescription,
                          patient: { ...currentPrescription.patient, name: e.target.value }
                        } : null)}
                        placeholder="Nom et prénom"
                        className="bg-white border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">Âge</Label>
                      <Input
                        value={currentPrescription?.patient.age || ""}
                        onChange={(e) => setCurrentPrescription(currentPrescription ? {
                          ...currentPrescription,
                          patient: { ...currentPrescription.patient, age: e.target.value }
                        } : null)}
                        placeholder="Ex: 45 ans"
                        className="bg-white border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">Téléphone</Label>
                      <Input
                        value={currentPrescription?.patient.phone || ""}
                        onChange={(e) => setCurrentPrescription(currentPrescription ? {
                          ...currentPrescription,
                          patient: { ...currentPrescription.patient, phone: e.target.value }
                        } : null)}
                        placeholder="Numéro de téléphone"
                        className="bg-white border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">Adresse</Label>
                      <Input
                        value={currentPrescription?.patient.address || ""}
                        onChange={(e) => setCurrentPrescription(currentPrescription ? {
                          ...currentPrescription,
                          patient: { ...currentPrescription.patient, address: e.target.value }
                        } : null)}
                        placeholder="Adresse complète"
                        className="bg-white border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Diagnostic */}
              <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-4 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <Activity className="h-5 w-5 text-amber-500" />
                    Diagnostic et Observations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Diagnostic principal</Label>
                    <Input
                      value={currentPrescription?.diagnosis || ""}
                      onChange={(e) => setCurrentPrescription(currentPrescription ? {
                        ...currentPrescription,
                        diagnosis: e.target.value
                      } : null)}
                      placeholder="Diagnostic établi"
                      className="bg-white border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Notes médicales</Label>
                    <Textarea
                      value={currentPrescription?.notes || ""}
                      onChange={(e) => setCurrentPrescription(currentPrescription ? {
                        ...currentPrescription,
                        notes: e.target.value
                      } : null)}
                      placeholder="Observations cliniques, recommandations..."
                      className="bg-white border-gray-300 rounded-md min-h-[100px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Médicaments */}
              <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-4 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <Pill className="h-5 w-5 text-blue-500" />
                    Prescription Médicamenteuse
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {currentPrescription?.medications.map((medication, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-slate-800">Médicament {index + 1}</h4>
                          {currentPrescription.medications.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMedication(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Nom du médicament</Label>
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(index, "name", e.target.value)}
                              placeholder="Dénomination commerciale"
                              className="bg-white border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Dosage</Label>
                            <Input
                              value={medication.dosage}
                              onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                              placeholder="Ex: 500mg, 1 comprimé"
                              className="bg-white border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Fréquence</Label>
                            <Input
                              value={medication.frequency}
                              onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                              placeholder="Ex: 3 fois par jour"
                              className="bg-white border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Durée</Label>
                            <Input
                              value={medication.duration}
                              onChange={(e) => updateMedication(index, "duration", e.target.value)}
                              placeholder="Ex: 7 jours"
                              className="bg-white border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Instructions particulières
                          </Label>
                          <Textarea
                            value={medication.instructions}
                            onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                            placeholder="Précautions, mode d'administration..."
                            className="bg-white border-gray-300 rounded-md resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      onClick={addMedication}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md border-dashed h-12"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Ajouter un médicament
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={savePrescription}
                  className="bg-slate-700 hover:bg-slate-800 text-white rounded-md shadow-sm flex-1 py-3 font-semibold transition-colors duration-200"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Enregistrer l'ordonnance
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setCurrentPrescription(null);
                    setViewMode("list");
                  }}
                  className="border-gray-300 text-slate-700 rounded-md flex-1 py-3"
                >
                  Annuler
                </Button>
                {currentPrescription && (
                  <Button 
                    variant="outline"
                    onClick={() => printPrescription(currentPrescription)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md px-6 py-3"
                  >
                    <Printer className="h-5 w-5 mr-2" />
                    Imprimer
                  </Button>
                )}
              </div>
            </div>

            {/* Aperçu */}
            <div className="xl:col-span-1">
              <Card className="bg-white border-gray-200 shadow-sm rounded-lg sticky top-24">
                <CardHeader className="pb-4 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <Eye className="h-5 w-5 text-slate-600" />
                    Aperçu Instantané
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6" ref={printRef}>
                  <div className="text-center border-b border-gray-200 pb-4 mb-4">
                    <h3 className="font-bold text-slate-800 text-lg">ORDONNANCE MÉDICALE</h3>
                    <p className="text-slate-600 text-sm mt-1">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm mb-2">PATIENT</h4>
                      <div className="bg-slate-50 p-3 rounded-md">
                        <p className="font-medium text-slate-800">{currentPrescription?.patient.name || "—"}</p>
                        <p className="text-slate-600 text-sm">{currentPrescription?.patient.age || "—"}</p>
                        <p className="text-slate-600 text-sm">{currentPrescription?.patient.phone || "—"}</p>
                      </div>
                    </div>

                    {currentPrescription?.diagnosis && (
                      <div>
                        <h4 className="font-semibold text-slate-700 text-sm mb-2">DIAGNOSTIC</h4>
                        <p className="text-slate-700 bg-amber-50 p-2 rounded-md text-sm">
                          {currentPrescription.diagnosis}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm mb-2">PRESCRIPTION</h4>
                      <div className="space-y-3">
                        {currentPrescription?.medications.filter(m => m.name).map((med, index) => (
                          <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                            <p className="font-medium text-slate-800 text-sm">{med.name}</p>
                            <div className="text-slate-600 text-xs space-y-1 mt-2">
                              {med.dosage && <p><strong>Dose:</strong> {med.dosage}</p>}
                              {med.frequency && <p><strong>Fréquence:</strong> {med.frequency}</p>}
                              {med.duration && <p><strong>Durée:</strong> {med.duration}</p>}
                              {med.instructions && <p className="italic">{med.instructions}</p>}
                          </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}