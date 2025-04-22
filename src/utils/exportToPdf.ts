// utils/exportToPdf.ts
import jsPDF from 'jspdf';
import { getUserIdFromToken } from './auth';

export function exportToPDF(data: any[], token: string) {
    const userId = getUserIdFromToken(token);
    if (!userId) throw new Error('Unauthorized: Invalid token');

    const doc = new jsPDF();
    data.forEach((item, i) => {
        doc.text(`${item.category}: $${item.amount} - ${item.description || ''}`, 10, 10 + i * 10);
    });
    doc.save('expenses.pdf');
}
