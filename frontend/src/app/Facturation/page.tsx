"use client";

import { useMemo, useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Printer,
  Download,
  FileText,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Send,
  MapPin,
  Mail,
  Pill,
  Stethoscope,
  Syringe
} from "lucide-react";

type LineItem = {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
};

type Invoice = {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  client: string;
  clientAddress?: string;
  clientEmail?: string;
  items: LineItem[];
  taxPct: number;
  notes?: string;
  status: "draft" | "sent" | "paid" | "overdue";
};

const SAMPLE_CLIENTS = [
  { 
    id: "1", 
    name: "Molka Hamdi", 
    address: "123 Rue de la Santé, Tunis", 
    phone: "12 345 678",
    email: "molka.hamdi@email.com"
  },
  { 
    id: "2", 
    name: "Clinique Essalem", 
    address: "456 Avenue Habib Bourguiba, Sfax", 
    phone: "74 123 456",
    email: "facturation@clinique-essalem.tn"
  },
  { 
    id: "3", 
    name: "Société Médicale SARL", 
    address: "789 Rue du Médecin, Sousse", 
    phone: "73 456 789",
    email: "compta@societemedicale.tn"
  },
  { 
    id: "4", 
    name: "Pharmacie Centrale", 
    address: "321 Avenue de la République, Tunis", 
    phone: "71 234 567",
    email: "pharmacie.centrale@email.tn"
  },
];

// Fonction pour formater en dinars tunisiens
const currency = (value: number) =>
  new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(value);

// Articles prédéfinis pour faciliter la saisie
const PREDEFINED_ITEMS = [
  { description: "Consultation générale", unitPrice: 30 },
  { description: "Consultation spécialisée", unitPrice: 50 },
  { description: "Visite à domicile", unitPrice: 70 },
  { description: "Analyse sanguine", unitPrice: 25 },
  { description: "Radiographie", unitPrice: 45 },
  { description: "Échographie", unitPrice: 80 },
  { description: "Vaccination", unitPrice: 20 },
  { description: "Pansement", unitPrice: 15 },
  { description: "Injection", unitPrice: 10 },
  { description: "Certificat médical", unitPrice: 15 },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-001",
      number: "FAC-2025-001",
      date: "2025-09-01",
      dueDate: "2025-09-15",
      client: "Molka Hamdi",
      clientAddress: "123 Rue de la Santé, Tunis",
      clientEmail: "molka.hamdi@email.com",
      taxPct: 19,
      status: "sent",
      items: [
        { id: "i1", description: "Consultation spécialisée", qty: 1, unitPrice: 50 },
        { id: "i2", description: "Analyse sanguine", qty: 1, unitPrice: 25 },
        { id: "i3", description: "Vaccination", qty: 1, unitPrice: 20 },
      ],
      notes: "Paiement à réception de la facture. RIB disponible sur demande.",
    },
    {
      id: "inv-002",
      number: "FAC-2025-002",
      date: "2025-08-28",
      dueDate: "2025-09-05",
      client: "Pharmacie Centrale",
      clientAddress: "321 Avenue de la République, Tunis",
      clientEmail: "pharmacie.centrale@email.tn",
      taxPct: 19,
      status: "paid",
      items: [
        { id: "i4", description: "Médicaments (lot A12)", qty: 10, unitPrice: 12 },
        { id: "i5", description: "Matériel médical", qty: 5, unitPrice: 8 },
      ],
      notes: "Facture réglée par virement bancaire",
    },
  ]);

  const [editing, setEditing] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedPredefinedItem, setSelectedPredefinedItem] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  const totals = useMemo(() => {
    if (!editing) return { subtotal: 0, tax: 0, total: 0 };
    const subtotal = editing.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
    const tax = (subtotal * (editing.taxPct || 0)) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [editing]);

  const createNewInvoice = () => {
    const now = new Date();
    const nextNumber = `FAC-${now.getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: nextNumber,
      date: now.toISOString().slice(0, 10),
      dueDate: new Date(now.getTime() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      client: SAMPLE_CLIENTS[0].name,
      clientAddress: SAMPLE_CLIENTS[0].address,
      clientEmail: SAMPLE_CLIENTS[0].email,
      items: [{ id: "li-" + Date.now(), description: "Consultation générale", qty: 1, unitPrice: 30 }],
      taxPct: 19,
      notes: "",
      status: "draft",
    };
    setEditing(invoice);
  };

  const saveInvoice = () => {
    if (!editing) return;
    setInvoices((prev) => {
      const exists = prev.find((p) => p.id === editing.id);
      if (exists) {
        return prev.map((p) => (p.id === editing.id ? editing : p));
      }
      return [editing, ...prev];
    });
    setEditing(null);
  };

  const addLine = () => {
    if (!editing) return;
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      description: "Nouvel article",
      qty: 1,
      unitPrice: 0,
    };
    setEditing({ ...editing, items: [...editing.items, newItem] });
  };

  const addPredefinedItem = () => {
    if (!editing || !selectedPredefinedItem) return;
    
    const selectedItem = PREDEFINED_ITEMS.find(item => item.description === selectedPredefinedItem);
    if (selectedItem) {
      const newItem: LineItem = {
        id: `li-${Date.now()}`,
        description: selectedItem.description,
        qty: 1,
        unitPrice: selectedItem.unitPrice,
      };
      setEditing({ ...editing, items: [...editing.items, newItem] });
      setSelectedPredefinedItem(""); // Reset selection
    }
  };

  const updateLine = (id: string, field: keyof LineItem, value: any) => {
    if (!editing) return;
    setEditing({
      ...editing,
      items: editing.items.map((it) =>
        it.id === id ? { ...it, [field]: value } : it
      ),
    });
  };

  const removeLine = (id: string) => {
    if (!editing) return;
    setEditing({ ...editing, items: editing.items.filter((it) => it.id !== id) });
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "sent": return "bg-blue-50 text-blue-700 border-blue-200";
      case "draft": return "bg-slate-50 text-slate-700 border-slate-200";
      case "overdue": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle2 className="h-3 w-3" />;
      case "sent": return <Send className="h-3 w-3" />;
      case "draft": return <FileText className="h-3 w-3" />;
      case "overdue": return <AlertTriangle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (search && !`${inv.number} ${inv.client}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Fonction d'impression professionnelle
  const handlePrint = () => {
    if (!editing) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture ${editing.number}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { font-family: 'Arial', sans-serif; color: #000; }
            }
            body { 
              font-family: 'Arial', sans-serif; 
              color: #000; 
              max-width: 21cm; 
              margin: 0 auto; 
              padding: 2cm;
              background: white;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 2cm; 
              border-bottom: 2px solid #000; 
              padding-bottom: 1cm;
            }
            .company-info { flex: 1; }
            .invoice-info { text-align: right; }
            .client-info { 
              margin-bottom: 1cm; 
              background: #f8f9fa; 
              padding: 0.5cm; 
              border-radius: 4px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 1cm 0; 
            }
            th { 
              background: #374151; 
              color: white; 
              padding: 0.5cm; 
              text-align: left;
              border: 1px solid #ddd;
            }
            td { 
              padding: 0.5cm; 
              border: 1px solid #ddd; 
              vertical-align: top;
            }
            .totals { 
              margin-top: 1cm; 
              text-align: right; 
              width: 50%; 
              margin-left: auto;
            }
            .totals-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 0.25cm;
            }
            .footer { 
              margin-top: 2cm; 
              padding-top: 1cm; 
              border-top: 1px solid #ddd; 
              text-align: center;
              color: #666;
            }
            .notes {
              margin-top: 1cm;
              padding: 0.5cm;
              background: #f8f9fa;
              border-radius: 4px;
            }
            .status-badge {
              display: inline-block;
              padding: 0.25cm 0.5cm;
              border-radius: 4px;
              font-weight: bold;
              margin-bottom: 0.5cm;
            }
            .paid { background: #d1fae5; color: #065f46; }
            .sent { background: #dbeafe; color: #1e40af; }
            .draft { background: #f3f4f6; color: #374151; }
            .overdue { background: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1 style="margin: 0; color: #1f2937;">CABINET MÉDICAL</h1>
              <p style="margin: 0.25cm 0; color: #6b7280;">
                123 Avenue du Médecin<br>
                Tunis, Tunisie<br>
                Tél: 71 234 567<br>
                contact@cabinetmedical.tn
              </p>
            </div>
            <div class="invoice-info">
              <h2 style="margin: 0; color: #1f2937;">FACTURE</h2>
              <p style="margin: 0.25cm 0; font-weight: bold;">${editing.number}</p>
              <div class="status-badge ${editing.status}">
                ${editing.status === 'paid' ? 'PAYÉE' : 
                  editing.status === 'sent' ? 'ENVOYÉE' : 
                  editing.status === 'draft' ? 'BROUILLON' : 'EN RETARD'}
              </div>
            </div>
          </div>

          <div class="client-info">
            <h3 style="margin: 0 0 0.5cm 0; color: #374151;">CLIENT</h3>
            <p style="margin: 0.25cm 0; font-weight: bold;">${editing.client}</p>
            <p style="margin: 0.25cm 0;">${editing.clientAddress || ''}</p>
            ${editing.clientEmail ? `<p style="margin: 0.25cm 0;">${editing.clientEmail}</p>` : ''}
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 1cm;">
            <div>
              <strong>Date d'émission:</strong><br>
              ${new Date(editing.date).toLocaleDateString('fr-FR')}
            </div>
            <div>
              <strong>Date d'échéance:</strong><br>
              ${new Date(editing.dueDate).toLocaleDateString('fr-FR')}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="width: 15%; text-align: center;">Quantité</th>
                <th style="width: 20%; text-align: right;">Prix Unitaire</th>
                <th style="width: 20%; text-align: right;">Montant</th>
              </tr>
            </thead>
            <tbody>
              ${editing.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.qty}</td>
                  <td style="text-align: right;">${currency(item.unitPrice)}</td>
                  <td style="text-align: right;">${currency(item.qty * item.unitPrice)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Sous-total:</span>
              <span>${currency(totals.subtotal)}</span>
            </div>
            <div class="totals-row">
              <span>TVA (${editing.taxPct}%):</span>
              <span>${currency(totals.tax)}</span>
            </div>
            <div class="totals-row" style="font-weight: bold; font-size: 1.2em; border-top: 1px solid #ddd; padding-top: 0.5cm;">
              <span>TOTAL:</span>
              <span>${currency(totals.total)}</span>
            </div>
          </div>

          ${editing.notes ? `
            <div class="notes">
              <strong>Notes:</strong><br>
              ${editing.notes}
            </div>
          ` : ''}

          <div class="footer">
            <p>Merci pour votre confiance</p>
            <p style="font-size: 0.9em; color: #9ca3af;">
              Cabinet Médical - MF: 12345678/A/B/C/123 - Article 6<br>
              IBAN: TN59 1234 5678 9012 3456 7891 234 - BIC: BFTNTNTT
            </p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé avant d'imprimer
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Facturation Médicale</h1>
                <p className="text-slate-600">Gestion professionnelle des factures et règlements</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
             
          
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Invoice List */}
          <div className="xl:col-span-4 space-y-6">
            {/* Filters */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher une facture..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white border-slate-300 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtre par statut
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "all", label: "Toutes" },
                        { value: "paid", label: "Payées" },
                        { value: "overdue", label: "En retard" },
                      ].map((filter) => (
                        <Button
                          key={filter.value}
                          variant={statusFilter === filter.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setStatusFilter(filter.value)}
                          className="justify-start text-sm"
                        >
                          {filter.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice List */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-800 text-lg">Factures Récentes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p>Aucune facture trouvée</p>
                    </div>
                  ) : (
                    filtered.map((inv) => {
                      const subtotal = inv.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
                      const total = subtotal * (1 + inv.taxPct / 100);
                      
                      return (
                        <div 
                          key={inv.id} 
                          className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                            editing?.id === inv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => setEditing(inv)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="font-medium text-slate-900 truncate">
                                  {inv.number}
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs border ${getStatusColor(inv.status)}`}
                                >
                                  {getStatusIcon(inv.status)}
                                  <span className="ml-1 capitalize">
                                    {
                                     inv.status === "paid" ? "Payée" :
                                     inv.status === "draft" ? "Brouillon" : "En retard"}
                                  </span>
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-slate-600 mb-1 truncate">
                                {inv.client}
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <div className="text-slate-500">
                                  {new Date(inv.date).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="font-medium text-slate-900">
                                  {currency(total)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="xl:col-span-8 space-y-6">
            {!editing ? (
              <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">
                    Aucune facture sélectionnée
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Sélectionnez une facture dans la liste ou créez-en une nouvelle pour commencer.
                  </p>
                  <Button 
                    onClick={createNewInvoice}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une facture
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6" ref={printRef}>
                {/* Invoice Header */}
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{editing.number}</h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Émission: {new Date(editing.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Échéance: {new Date(editing.dueDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Select 
                          value={editing.status} 
                          onValueChange={(val) => setEditing({ ...editing, status: val as Invoice["status"] })}
                        >
                          <SelectTrigger className="w-[140px] bg-white border-slate-300 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                      
                            <SelectItem value="paid">Payée</SelectItem>
                            <SelectItem value="overdue">En retard</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300 rounded-lg"
                            onClick={handlePrint}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-300 rounded-lg">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Client and Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Client
                          </Label>
                          <Select 
                            value={editing.client} 
                            onValueChange={(val) => {
                              const client = SAMPLE_CLIENTS.find(c => c.name === val);
                              setEditing({ 
                                ...editing, 
                                client: val,
                                clientAddress: client?.address,
                                clientEmail: client?.email
                              });
                            }}
                          >
                            <SelectTrigger className="bg-white border-slate-300 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SAMPLE_CLIENTS.map((client) => (
                                <SelectItem key={client.id} value={client.name}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {editing.clientAddress && (
                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {editing.clientAddress}
                            </div>
                            {editing.clientEmail && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {editing.clientEmail}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Date d'émission
                          </Label>
                          <Input
                            type="date"
                            value={editing.date}
                            onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                            className="bg-white border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Date d'échéance
                          </Label>
                          <Input
                            type="date"
                            value={editing.dueDate}
                            onChange={(e) => setEditing({ ...editing, dueDate: e.target.value })}
                            className="bg-white border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Articles prédéfinis */}
                    <Card className="bg-slate-50 border-slate-200 mb-6">
                      <CardContent className="p-4">
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-slate-700 mb-2 block">
                              Articles prédéfinis
                            </Label>
                            <Select value={selectedPredefinedItem} onValueChange={setSelectedPredefinedItem}>
                              <SelectTrigger className="bg-white border-slate-300 rounded-lg">
                                <SelectValue placeholder="Sélectionner un article" />
                              </SelectTrigger>
                              <SelectContent>
                                {PREDEFINED_ITEMS.map((item, index) => (
                                  <SelectItem key={index} value={item.description}>
                                    {item.description} - {currency(item.unitPrice)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            onClick={addPredefinedItem}
                            disabled={!selectedPredefinedItem}
                            className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Line Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-slate-700">
                          Articles de la facture
                        </Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addLine}
                          className="border-slate-300 text-slate-700 rounded-lg"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nouvel article
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {editing.items.map((item, index) => (
                          <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-slate-50 rounded-lg">
                            <div className="col-span-5">
                              <Input
                                placeholder="Description de l'article"
                                value={item.description}
                                onChange={(e) => updateLine(item.id, "description", e.target.value)}
                                className="bg-white border-slate-300 rounded-lg"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                min={1}
                                placeholder="Quantité"
                                value={item.qty}
                                onChange={(e) => updateLine(item.id, "qty", Number(e.target.value))}
                                className="bg-white border-slate-300 rounded-lg"
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                min={0}
                                step="0.01"
                                placeholder="Prix unitaire"
                                value={item.unitPrice}
                                onChange={(e) => updateLine(item.id, "unitPrice", Number(e.target.value))}
                                className="bg-white border-slate-300 rounded-lg"
                              />
                            </div>
                            <div className="col-span-1 text-right font-medium text-slate-900">
                              {currency(item.qty * item.unitPrice)}
                            </div>
                            <div className="col-span-1 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLine(item.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals and Notes */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            TVA (%)
                          </Label>
                          <Input
                            type="number"
                            value={editing.taxPct}
                            onChange={(e) => setEditing({ ...editing, taxPct: Number(e.target.value) })}
                            className="bg-white border-slate-300 rounded-lg w-32"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Notes additionnelles
                          </Label>
                          <Textarea
                            placeholder="Informations complémentaires..."
                            value={editing.notes}
                            onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                            className="bg-white border-slate-300 rounded-lg resize-none min-h-[100px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Sous-total</span>
                          <span>{currency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>TVA ({editing.taxPct}%)</span>
                          <span>{currency(totals.tax)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-3">
                          <div className="flex justify-between text-lg font-bold text-slate-900">
                            <span>Total TTC</span>
                            <span>{currency(totals.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                      <Button 
                        variant="outline" 
                        onClick={() => setEditing(null)}
                        className="border-slate-300 text-slate-700 rounded-lg"
                      >
                        Annuler
                      </Button>
                      
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline"
                          className="border-slate-300 text-slate-700 rounded-lg"
                          onClick={handlePrint}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimer
                        </Button>
                        <Button 
                          onClick={saveInvoice}
                          className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Finaliser la facture
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}