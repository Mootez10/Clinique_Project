import { Equipment } from './apiequipement';

// Fonction utilitaire pour convertir en nombre
const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const exportToPDF = async (equipment: Equipment[], filename: string) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('RAPPORT DE STOCK - CLINIQUE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 28, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 196, 35);
    
    // Statistiques avec conversion
    const totalValue = equipment.reduce((sum, item) => {
      const unitPrice = toNumber(item.unitPrice);
      return sum + (item.quantity * unitPrice);
    }, 0);
    
    const lowStockItems = equipment.filter(item => item.quantity <= item.minStock && item.quantity > 0).length;
    const outOfStockItems = equipment.filter(item => item.quantity === 0).length;
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Total équipements: ${equipment.length}`, 14, 45);
    doc.text(`Stock bas: ${lowStockItems}`, 14, 52);
    doc.text(`En rupture: ${outOfStockItems}`, 14, 59);
    doc.text(`Valeur totale: ${totalValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`, 14, 66);
    
    // En-tête du tableau
    let yPosition = 80;
    
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.rect(14, yPosition, 182, 8, 'F');
    doc.text('Nom', 16, yPosition + 5);
    doc.text('Catégorie', 60, yPosition + 5);
    doc.text('Qte', 90, yPosition + 5);
    doc.text('Min', 100, yPosition + 5);
    doc.text('Prix', 110, yPosition + 5);
    doc.text('Valeur', 130, yPosition + 5);
    doc.text('Statut', 160, yPosition + 5);
    
    yPosition += 8;
    
    // Données du tableau
    equipment.forEach((item, index) => {
      const unitPrice = toNumber(item.unitPrice);
      const totalItemValue = item.quantity * unitPrice;
      
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition, 182, 8, 'F');
      }
      
      if (item.quantity === 0) {
        doc.setTextColor(220, 38, 38);
      } else if (item.quantity <= item.minStock) {
        doc.setTextColor(249, 115, 22);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      
      doc.setFontSize(7);
      doc.text(item.name.substring(0, 25), 16, yPosition + 5);
      doc.text(item.category.substring(0, 12), 60, yPosition + 5);
      doc.text(item.quantity.toString(), 90, yPosition + 5);
      doc.text(item.minStock.toString(), 100, yPosition + 5);
      doc.text(`${unitPrice.toFixed(2)}€`, 110, yPosition + 5);
      doc.text(`${totalItemValue.toFixed(2)}€`, 130, yPosition + 5);
      
      let status = 'OK';
      let statusColor = [34, 197, 94];
      
      if (item.quantity === 0) {
        status = 'RUPTURE';
        statusColor = [220, 38, 38];
      } else if (item.quantity <= item.minStock) {
        status = 'STOCK BAS';
        statusColor = [249, 115, 22];
      }
      
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(status, 160, yPosition + 5);
      
      yPosition += 8;
      
      if (yPosition > 280 && index < equipment.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} sur ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF');
  }
};

export const exportLowStockPDF = async (equipment: Equipment[]) => {
  const lowStockItems = equipment.filter(item => item.quantity <= item.minStock);
  await exportToPDF(lowStockItems, `stock-bas-clinique-${new Date().toLocaleDateString('fr-FR')}`);
};