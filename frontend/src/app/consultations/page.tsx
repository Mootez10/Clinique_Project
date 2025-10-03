"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  User, 
  Plus,
  ArrowUpRight,
  Search,
  Clock,
  CalendarDays,
  Users,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ConsultationsPage() {
  const consultations = [
    {
      id: "1",
      patient: "Alice Dupont",
      date: "01 Oct 2025 - 14h30",
      diagnostic: "Grippe saisonnière",
      lastVisit: "15 Jun 2025",
      age: "34 ans",
      status: "completed",
      priority: "medium"
    },
    {
      id: "2",
      patient: "Mohamed Salah",
      date: "28 Sep 2025 - 09h00",
      diagnostic: "Migraine chronique",
      lastVisit: "20 Aug 2025",
      age: "42 ans",
      status: "scheduled",
      priority: "low"
    },
    {
      id: "3",
      patient: "Yasmine Ben Ali",
      date: "25 Sep 2025 - 16h00",
      diagnostic: "Douleurs articulaires",
      lastVisit: "12 Sep 2025",
      age: "28 ans",
      status: "in-progress",
      priority: "high"
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary";
      case "in-progress":
        return "default";
      case "scheduled":
        return "outline";
      default:
        return "outline";
    }
  };

  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <Stethoscope className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Consultations
                </h1>
                <p className="text-slate-600 mt-1">
                  Gestion médicale et suivi des patients
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher une consultation..."
                className="pl-10 w-full sm:w-[300px] bg-white border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <Link href="/consultations/add" passHref>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle consultation
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-slate-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Consultations du mois</p>
                  <p className="text-2xl font-bold text-slate-900">24</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-slate-500">Dans les objectifs</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <CalendarDays className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">En attente</p>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-slate-500">À traiter</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Clock className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Nouveaux patients</p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-slate-500">Ce mois-ci</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Users className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {consultations.map((consultation) => (
            <Card 
              key={consultation.id} 
              className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group rounded-lg overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-200">
                      <User className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {consultation.patient}
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        {consultation.age} • Dernier: {consultation.lastVisit}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={getStatusVariant(consultation.status)} 
                    className="text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-100"
                  >
                    {consultation.status === "completed" ? "Terminée" : 
                     consultation.status === "in-progress" ? "En cours" : "Planifiée"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">{consultation.date}</span>
                  </div>
                  
                  <div className="flex items-start gap-3 text-slate-700">
                    <Stethoscope className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Diagnostic</p>
                      <p className="text-sm text-slate-600 mt-1">{consultation.diagnostic}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50 rounded-lg"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Dossier
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors duration-200"
                    onClick={() => setSelectedConsultation(consultation)}
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Ouvrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {consultations.length === 0 && (
          <Card className="bg-white border-slate-200 rounded-lg text-center py-12">
            <CardContent>
              <div className="p-3 bg-slate-100 rounded-full w-12 h-12 mx-auto mb-4">
                <Stethoscope className="h-6 w-6 text-slate-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-slate-700 mb-2">Aucune consultation</h3>
              <p className="text-slate-500 text-sm mb-4">
                Aucune consultation n'est programmée pour le moment.
              </p>
              <Link href="/consultations/add" passHref>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Planifier une consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Dialog (popup patient) */}
        <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Fiche Patient</DialogTitle>
            </DialogHeader>
            {selectedConsultation && (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{selectedConsultation.patient}</p>
                  <p className="text-sm text-slate-600">{selectedConsultation.age}</p>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Date :</strong> {selectedConsultation.date}</p>
                  <p><strong>Dernière visite :</strong> {selectedConsultation.lastVisit}</p>
                  <p><strong>Diagnostic :</strong> {selectedConsultation.diagnostic}</p>
                  <p><strong>Statut :</strong> {selectedConsultation.status}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
