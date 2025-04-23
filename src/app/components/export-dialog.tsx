"use client"

import { SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

import { toast } from "sonner"
import { generatePDF } from "../lib/pdf-generator"
import type { Expense } from "../lib/types"
import { Download, Calendar } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenses: Expense[]
}

export function ExportDialog({ open, onOpenChange, expenses }: ExportDialogProps) {
  const [month, setMonth] = useState<string>(new Date().getMonth().toString())
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
    { value: "all", label: "All Months" },
  ]

  // Generate years (current year and 5 years back)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }))

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setProgress(0)

      // Filter expenses by selected month and year
      let filteredExpenses = [...expenses]

      if (month !== "all") {
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.createdAt)
          return (
            expenseDate.getMonth() === Number.parseInt(month) && expenseDate.getFullYear() === Number.parseInt(year)
          )
        })
      } else {
        // If "All Months" is selected, just filter by year
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.createdAt)
          return expenseDate.getFullYear() === Number.parseInt(year)
        })
      }

      if (filteredExpenses.length === 0) {
        // toast({
        //   title: "No transactions found",
        //   description: "There are no transactions for the selected period.",
        //   variant: "destructive",
        // })
        toast("No transactions found", {
            description: "There are no transactions for the selected period."
          })
        setIsExporting(false)
        return
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Generate PDF with progress callback
      await generatePDF(filteredExpenses, (progressValue) => {
        if (progressValue === 100) {
          clearInterval(progressInterval);
        }
        setProgress(progressValue);
      });

      setProgress(100)

      toast("Export successful", {
        description: "Your transactions have been exported successfully."
      })

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false)
        setIsExporting(false)
        setProgress(0)
      }, 1000)
    } catch (error) {
       toast("Export failed", {
        description: "Something went wrong."
      })
      setIsExporting(false)
      setProgress(0)
    }
  }

  const getMonthYearLabel = () => {
    const selectedMonth = months.find((m) => m.value === month)?.label
    return month === "all" ? `All months in ${year}` : `${selectedMonth} ${year}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-violet-100 dark:border-violet-800/30 shadow-lg shadow-violet-500/5">
        <DialogHeader>
          <DialogTitle>Export Transactions</DialogTitle>
          <DialogDescription>Select a month and year to export your transactions as PDF.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month" className="text-sm font-medium">
                Month
              </Label>
              <Select value={month} onValueChange={setMonth} disabled={isExporting}>
                <SelectTrigger
                  id="month"
                  className="rounded-lg border-violet-100 focus:border-violet-300 focus:ring-violet-300 dark:border-violet-800/30"
                >
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">
                Year
              </Label>
              <Select value={year} onValueChange={setYear} disabled={isExporting}>
                <SelectTrigger
                  id="year"
                  className="rounded-lg border-violet-100 focus:border-violet-300 focus:ring-violet-300 dark:border-violet-800/30"
                >
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isExporting && (
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span>Generating PDF...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-violet-100 dark:bg-violet-800/30" />
            </div>
          )}

          <div className="bg-violet-50 dark:bg-violet-900/10 p-3 rounded-lg flex items-center gap-2 mt-2">
            <Calendar className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <span className="text-sm">{getMonthYearLabel()}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
            className="rounded-lg border-violet-200 hover:bg-violet-100/50 dark:border-violet-800 dark:hover:bg-violet-800/20 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-violet-500/25"
          >
            {isExporting ? (
              "Exporting..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
