'use client';

import { forwardRef } from 'react';
import { Prescription } from '@/types/prescription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrescriptionPrintProps {
  prescription: Prescription;
}

export const PrescriptionPrint = forwardRef<HTMLDivElement, PrescriptionPrintProps>(
  ({ prescription }, ref) => {
    // Récupérer les infos patient (soit via relation, soit manuelles)
    const patientInfo = prescription.patient || {
      firstName: prescription.patientFirstName || '',
      lastName: prescription.patientLastName || '',
      dateOfBirth: prescription.patientDateOfBirth || '',
      phone: prescription.patientPhone || '',
    };

    const calculateAge = (dateOfBirth: string) => {
      if (!dateOfBirth) return 'N/A';
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    return (
      <div ref={ref} className="bg-white p-8 print:p-0">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}</style>

        <div className="max-w-4xl mx-auto">
          {/* En-tête avec bordure décorative */}
          <div className="border-4 border-blue-600 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              {/* Informations du médecin */}
              <div>
                <h1 className="text-2xl font-bold text-blue-800 mb-2">
                  {prescription.doctorName}
                </h1>
                {prescription.doctorSpecialty && (
                  <p className="text-lg text-gray-700">{prescription.doctorSpecialty}</p>
                )}
                <div className="mt-3 text-sm text-gray-600">
                  <p>📞 Téléphone: +216 XX XXX XXX</p>
                  <p>📧 Email: cabinet@email.com</p>
                  <p>📍 Adresse du cabinet</p>
                </div>
              </div>

              {/* Logo et date */}
              <div className="text-right">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(prescription.date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </div>

          {/* Informations du patient */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Informations du Patient
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Nom complet:</span>{' '}
                {patientInfo.firstName} {patientInfo.lastName}
              </div>
              {patientInfo.dateOfBirth && (
                <>
                  <div>
                    <span className="font-semibold">Âge:</span>{' '}
                    {calculateAge(patientInfo.dateOfBirth)} ans
                  </div>
                  <div>
                    <span className="font-semibold">Date de naissance:</span>{' '}
                    {format(new Date(patientInfo.dateOfBirth), 'dd/MM/yyyy')}
                  </div>
                </>
              )}
              {patientInfo.phone && (
                <div>
                  <span className="font-semibold">Téléphone:</span>{' '}
                  {patientInfo.phone}
                </div>
              )}
            </div>
          </div>

          {/* Ordonnance */}
          <div className="mb-6">
            <div className="border-b-2 border-blue-600 pb-2 mb-4">
              <h2 className="text-xl font-bold text-blue-800">ORDONNANCE MÉDICALE</h2>
            </div>

            <div className="space-y-6">
              {prescription.items.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {index + 1}. {item.medicationName}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">📊 Dosage:</span> {item.dosage}
                    </p>
                    <p>
                      <span className="font-semibold">🕐 Fréquence:</span> {item.frequency}
                    </p>
                    <p>
                      <span className="font-semibold">⏱️ Durée:</span> {item.duration}
                    </p>
                    {item.instructions && (
                      <p className="mt-2 italic">
                        <span className="font-semibold">💡 Instructions:</span>{' '}
                        {item.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conseils médicaux */}
          {prescription.notes && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-gray-800 mb-2">
                ⚕️ Conseils et Recommandations
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {prescription.notes}
              </p>
            </div>
          )}

          {/* Signature */}
          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 px-8">
                <p className="font-semibold">{prescription.doctorName}</p>
                {prescription.doctorSpecialty && (
                  <p className="text-sm text-gray-600">{prescription.doctorSpecialty}</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Signature et cachet</p>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
            <p>
              Cette ordonnance est valable 3 mois à compter de sa date d'émission • Ne pas
              jeter sur la voie publique
            </p>
            <p className="mt-1">
              Document généré le{' '}
              {format(new Date(), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PrescriptionPrint.displayName = 'PrescriptionPrint';