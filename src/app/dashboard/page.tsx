"use client"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ExpenseForm } from "../components/expense-form"
import { ExpenseList } from "../components/expense-list"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardShell } from "../components/dashboard-shell"
import { getUserExpenses } from "../lib/expenses"
import type { Expense, ExpenseApiResponse } from "../lib/types"
import { Download, Plus, BarChart3, IndianRupee, CreditCard, Wallet , Calendar, RefreshCw} from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ExportDialog } from "../components/export-dialog"
import { DatePicker } from "../components//date-picker"

import { format } from "date-fns"

import { toast } from "sonner"
export default function DashboardPage() {
  const [expenseData, setExpenseData] = useState<ExpenseApiResponse>({
    income: 0,
    expense: 0,
    expenses: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

 // Get first day of current month for default start date

 const today = new Date()

 const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

 const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth)

 const [endDate, setEndDate] = useState<Date | undefined>(today)

 const [isRefreshing, setIsRefreshing] = useState(false)



  const fetchExpenses = async (start?: Date, end?: Date) => {

    try {

      setIsRefreshing(true)



      // If dates are provided, format them as YYYY-MM-DD

      const startDateParam = start ? format(start, "yyyy-MM-dd") : undefined

      const endDateParam = end ? format(end, "yyyy-MM-dd") : undefined



    
      if (startDateParam && endDateParam) {

          const data = await getUserExpenses(startDate, endDate);
          setExpenseData(data)
      }else{

      toast.warning('Please select both a start date and an end date .', {
        style: { backgroundColor: '#f59e0b', color: '#fff' }, // Custom background and text color
      });

      } 

    } catch (error) {

      console.error("Failed to fetch expenses:", error)

    } finally {

      setIsLoading(false)

      setIsRefreshing(false)

    }

  }


  useEffect(() => {

    fetchExpenses(startDate, endDate)

  }, [])

  const handleDateFilterApply = () => {
    fetchExpenses(startDate, endDate)
  }

  const handleAddExpense = (expense: Expense) => {
    setExpenseData((prev) => ({
      income: expense.category === "Income" ? prev.income + expense.amount : prev.income,
      expense: expense.category === "Expense" ? prev.expense + expense.amount : prev.expense,
      expenses: [expense, ...prev.expenses],
    }))
    setDialogOpen(false)
    fetchExpenses(startDate, endDate)
  }

  const handleDeleteExpense = (id: string) => {
    const expenseToDelete = expenseData.expenses.find((expense) => expense._id === id)

    if (expenseToDelete) {
      setExpenseData((prev) => ({
        income: expenseToDelete.category === "Income" ? prev.income - expenseToDelete.amount : prev.income,
        expense: expenseToDelete.category === "Expense" ? prev.expense - expenseToDelete.amount : prev.expense,
        expenses: prev.expenses.filter((expense) => expense._id !== id),
      }))
    }
  }



  const balance = expenseData.income - expenseData.expense

  return (
    <DashboardShell>
      <DashboardHeader heading="Expense Manager" text="Manage your income and expenses in one place.">
        <div className="flex space-x-2">
          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-violet-500/25"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
          <Button
            variant="outline"
            onClick={() => setExportDialogOpen(true)}
            className="rounded-lg border-violet-200 hover:bg-violet-100/50 dark:border-violet-800 dark:hover:bg-violet-800/20 transition-all duration-300"
          >
            <Download 
              className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </DashboardHeader>
        {/* Date Range Filter */}

        <Card className="mb-6 border-violet-100 dark:border-violet-800/30 shadow-sm">

<CardHeader className="pb-3">

  <CardTitle className="text-sm font-medium flex items-center">

    <Calendar className="h-4 w-4 mr-2 text-violet-600" />

    Date Range Filter

  </CardTitle>

</CardHeader>

<CardContent>

  <div className="flex flex-col sm:flex-row gap-4 items-end">

    <div className="grid gap-2 flex-1">

      <label htmlFor="start-date" className="text-sm font-medium">

        Start Date

      </label>

      <DatePicker id="start-date" date={startDate} setDate={setStartDate} className="w-full"  />

    </div>

    <div className="grid gap-2 flex-1">

      <label htmlFor="end-date" className="text-sm font-medium">

        End Date

      </label>

      <DatePicker id="end-date" date={endDate} setDate={setEndDate} className="w-full"  minDate={startDate} />

    </div>

    <Button

      onClick={handleDateFilterApply}

      disabled={isRefreshing}

      className="rounded-lg bg-violet-600 hover:bg-violet-700 transition-all duration-300"

    >

      {isRefreshing ? (

        <>

          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />

          Refreshing...

        </>

      ) : (

        "Apply Filter"

      )}

    </Button>

  </div>

  {startDate && endDate && (

    <p className="text-xs text-muted-foreground mt-2">

      Showing transactions from {format(startDate, "MMMM d, yyyy")} to {format(endDate, "MMMM d, yyyy")}

    </p>

  )}

</CardContent>

</Card>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-violet-100 dark:border-violet-800/30 shadow-md hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-2">
                <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{expenseData.income.toFixed(2)}
              </div>

              <p className="text-xs text-muted-foreground mt-1">  {startDate && endDate ? `Income in selected period` : "All time income"}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-violet-100 dark:border-violet-800/30 shadow-md hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <div className="rounded-full bg-red-100 dark:bg-red-800/30 p-2">
                <CreditCard className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">₹{expenseData.expense.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1"> {startDate && endDate ? `Expenses in selected period` : "All time expenses"}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-violet-100 dark:border-violet-800/30 shadow-md hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <div className="rounded-full bg-violet-100 dark:bg-violet-800/30 p-2">
                <Wallet className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${balance >= 0 ? "text-violet-600 dark:text-violet-400" : "text-red-600 dark:text-red-400"}`}
              >
                ₹{balance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1"> {startDate && endDate ? `Balance in selected period` : "Current balance"}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-violet-100 dark:border-violet-800/30 shadow-md hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <div className="rounded-full bg-violet-100 dark:bg-violet-800/30 p-2">
                <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenseData.expenses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{startDate && endDate ? `Transactions in selected period` : "Total transactions"}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-violet-100 dark:border-violet-800/30 shadow-lg shadow-violet-500/5">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>Enter the details of your income or expense</DialogDescription>
          </DialogHeader>
          <ExpenseForm onAddExpense={handleAddExpense} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
        {/* Export Dialog */}
        <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} expenses={expenseData.expenses} />

      <div className="mt-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-lg bg-violet-50 dark:bg-violet-950/20">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
            >
              All Transactions
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
            >
              Income
            </TabsTrigger>
            <TabsTrigger
              value="expense"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
            >
              Expenses
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <ExpenseList expenses={expenseData.expenses} onDeleteExpense={handleDeleteExpense} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            <ExpenseList
              expenses={expenseData.expenses.filter((e) => e.category === "Income")}
              onDeleteExpense={handleDeleteExpense}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="expense" className="mt-4">
            <ExpenseList
              expenses={expenseData.expenses.filter((e) => e.category === "Expense")}
              onDeleteExpense={handleDeleteExpense}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
} 