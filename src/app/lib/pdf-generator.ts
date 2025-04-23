import type { Expense } from "./types"
import { formatDate } from "./utils"

export async function generatePDF(
    expenses: Expense[],
    onProgress: (progress: number) => void
): Promise<void> {
    try {
        // Calculate totals
        const totalIncome = expenses
            .filter((expense) => expense.category === "Income")
            .reduce((sum, expense) => sum + expense.amount, 0)

        const totalExpenses = expenses
            .filter((expense) => expense.category === "Expense")
            .reduce((sum, expense) => sum + expense.amount, 0)

        const balance = totalIncome - totalExpenses

        // Create a simple CSV string for demonstration
        let csvContent = "Date,Description,Category,Amount\n"
        const totalSteps = expenses.length + 1 // Add 1 for totals line

        expenses.forEach((expense, index) => {
            csvContent += `${formatDate(expense.createdAt)},${expense.description || ""},${expense.category
                },${expense.amount.toFixed(2)}\n`

            // Update progress after each row
            onProgress(Math.floor(((index + 1) / expenses.length) * 100))
        })

        // Add totals
        csvContent += `\nTotal Income,${totalIncome.toFixed(2)}\n`
        csvContent += `Total Expenses,${totalExpenses.toFixed(2)}\n`
        csvContent += `Balance,${balance.toFixed(2)}\n`

        // Update progress to 100% after finishing the CSV creation
        onProgress(100)

        // Create a blob and download it
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `expense-report-${new Date().toISOString().split("T")[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        console.log("PDF generation would happen here in a real app")
    } catch (error) {
        console.error("Error generating PDF:", error)
        throw new Error("Failed to generate PDF")
    }
}
