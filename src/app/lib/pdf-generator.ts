import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Expense } from './types';
import { formatDate } from './utils';

export async function generatePDF(
    expenses: Expense[],
    onProgress: (progress: number) => void
): Promise<void> {
    try {
        const doc = new jsPDF();

        // Calculate totals
        const totalIncome = expenses
            .filter((expense) => expense.category === 'Income')
            .reduce((sum, expense) => sum + expense.amount, 0);

        const totalExpenses = expenses
            .filter((expense) => expense.category === 'Expense')
            .reduce((sum, expense) => sum + expense.amount, 0);

        const balance = totalIncome - totalExpenses;

        // Prepare table data
        const tableData = expenses.map((expense) => [
            formatDate(expense.createdAt),
            expense.description || '',
            expense.category,
            expense.amount.toFixed(2),
        ]);

        // Define table headers
        const headers = [['Date', 'Description', 'Category', 'Amount']];

        // Add title
        doc.setFontSize(18);
        doc.text('Expense Report', 14, 22);

        // Add table
        autoTable(doc, {
            head: headers,
            body: tableData,
            startY: 30,
        });

        // Add totals
        const finalY = (doc as any).lastAutoTable.finalY || 30;
        doc.setFontSize(12);
        doc.setFont('Roboto', 'bold');
        doc.text(`Total Income: ${totalIncome.toFixed(2)}`, 14, finalY + 10);
        doc.text(`Total Expenses: ${totalExpenses.toFixed(2)}`, 14, finalY + 16);
        doc.text(`Balance: ${balance.toFixed(2)}`, 14, finalY + 22);

        // Save the PDF
        doc.save(`expense-report-${new Date().toISOString().split('T')[0]}.pdf`);

        // Update progress to 100%
        onProgress(100);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}
