"use client"

import {useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

import { toast } from "sonner"
import { generatePDF } from "../lib/pdf-generator"
import type { Expense } from "../lib/types"
import { Download, Calendar,Loader2 } from "lucide-react"
import Cookies from "js-cookie"

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
  const [currentStep, setCurrentStep] = useState("")



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
    setIsExporting(true);
    setProgress(0);
    setCurrentStep("Initializing...")
    // Construct start and end dates based on selected month and year
    const startDate = new Date(Number(year), month === 'all' ? 0 : Number(month), 1);
    const endDate = new Date(Number(year), month === 'all' ? 11 : Number(month), 31);

    // Format dates as 'YYYY-MM-DD'
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

     // Step 2: Fetching data - 10%

     setProgress(10)

     setCurrentStep("Fetching expense data...")

     toast.info("Fetching expense data...")



     // Add a small delay to show the fetching state

     await new Promise((resolve) => setTimeout(resolve, 500))


    // Fetch filtered expenses from the API
    const response = await fetch(
      `/api/expenses/date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch expenses');
    }
    // Step 3: Processing data - 30%

    setProgress(30)

    setCurrentStep("Processing expense data...")
    const { expenses: filteredExpenses } = await response.json();


    if (filteredExpenses.length === 0) {
      toast.error('No transactions found', {
        description: 'There are no transactions for the selected period.',
      });
      setIsExporting(false);
      return;
    }

      // Step 4: Preparing PDF - 40%

      setProgress(40)

      setCurrentStep("Preparing PDF document...")

      toast.info("Preparing PDF document...")
        // Add a small delay to simulate PDF preparation

        await new Promise((resolve) => setTimeout(resolve, 300))



        // Step 5: Building PDF - 50-90% (handled by the generatePDF function)
  
        setProgress(50)
  
        setCurrentStep("Building PDF document...")
  
        toast.info("Building PDF document...")
  
  
  
       // Calculate how many progress updates we need based on data size
       const dataSize = filteredExpenses.length
       const progressStep = dataSize > 100 ? 1 : dataSize > 50 ? 2 : 5
 
       // Generate PDF with custom progress callback
       await generatePDF(filteredExpenses, (progressValue) => {
         // Map the progress from the PDF generator (0-100) to our range (50-90)
         const scaledProgress = 50 + progressValue * 0.4
         setProgress(Math.min(90, scaledProgress))
 
         // Update step text based on progress
         if (progressValue < 30) {
           setCurrentStep("Processing expense data...")
         } else if (progressValue < 60) {
           setCurrentStep("Generating tables...")
         } else if (progressValue < 90) {
           setCurrentStep("Finalizing document...")
         } else {
           setCurrentStep("Saving PDF file...")
         }
       })
 
       // Step 6: Finalizing - 100%
       setProgress(100)
       setCurrentStep("Export completed!")
       toast.success("Export successful", {
         description: "Your transactions have been exported successfully.",
       })
 
       // Close dialog after a short delay
       setTimeout(() => {
         onOpenChange(false)
         setIsExporting(false)
         setProgress(0)
         setCurrentStep("")
       }, 1500)
     } catch (error) {
       console.error("Export failed:", error)
       toast.error("Export failed", {
         description: error instanceof Error ? error.message : "Something went wrong.",
       })
       setIsExporting(false)
       setProgress(0)
       setCurrentStep("")
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
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  {progress < 100 && <Loader2 className="h-3 w-3 animate-spin text-violet-600" />}
                  <span>{currentStep}</span>
                </div>
                <span className="font-mono">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-violet-100 dark:bg-violet-800/30"
                style={{
                  transition: "all 0.3s ease",
                }}
              />
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
