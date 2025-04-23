"use client"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ExpenseForm } from "../components/expense-form"
import { ExpenseList } from "../components/expense-list"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardShell } from "../components/dashboard-shell"
import { getUserExpenses } from "../lib/expenses"
import type { Expense, ExpenseApiResponse } from "../lib/types"
import { Download, Plus, BarChart3, IndianRupee, CreditCard, Wallet } from "lucide-react"
import { generatePDF } from "../lib/pdf-generator"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ExportDialog } from "../components/export-dialog"

export default function DashboardPage() {
  const [expenseData, setExpenseData] = useState<ExpenseApiResponse>({
    income: 0,
    expense: 0,
    expenses: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)


  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getUserExpenses()
        setExpenseData(data)
      } catch (error) {
        console.error("Failed to fetch expenses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const handleAddExpense = (expense: Expense) => {
    setExpenseData((prev) => ({
      income: expense.category === "Income" ? prev.income + expense.amount : prev.income,
      expense: expense.category === "Expense" ? prev.expense + expense.amount : prev.expense,
      expenses: [expense, ...prev.expenses],
    }))
    setDialogOpen(false)
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
              <p className="text-xs text-muted-foreground mt-1">All time income</p>
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
              <p className="text-xs text-muted-foreground mt-1">All time expenses</p>
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
              <p className="text-xs text-muted-foreground mt-1">Current balance</p>
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
              <p className="text-xs text-muted-foreground mt-1">Total transactions</p>
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