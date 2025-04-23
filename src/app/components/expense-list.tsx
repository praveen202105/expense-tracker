"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"

import type { Expense } from "../lib/types"
import { deleteExpense } from "../lib/expenses"
import { formatDate } from "../lib/utils"
import { Trash2, IndianRupee, CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface ExpenseListProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
  isLoading: boolean
}

export function ExpenseList({ expenses, onDeleteExpense, isLoading }: ExpenseListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setIsDeleting(true)
      await deleteExpense(deleteId)
      onDeleteExpense(deleteId)
      toast("Transaction deleted");
      
    } catch (error) {
      toast("Failed to delete transaction");
      
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-8 border-violet-100 dark:border-violet-800/30 shadow-md">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      </Card>
    )
  }

  if (expenses.length === 0) {
    return (
      <Card className="p-8 text-center border-violet-100 dark:border-violet-800/30 shadow-md">
        <p className="text-muted-foreground">No transactions found.</p>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-violet-100 dark:border-violet-800/30 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-violet-50 dark:bg-violet-950/20 hover:bg-violet-100 dark:hover:bg-violet-900/20">
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <motion.tr
                  key={expense._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-violet-100 dark:border-violet-800/30 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors"
                >
                  <TableCell className="font-medium">{formatDate(expense.createdAt)}</TableCell>
                  <TableCell>{expense.description || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        expense.category === "Income"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {expense.category === "Income" ? (
                        <IndianRupee className="h-3 w-3" />
                      ) : (
                        <CreditCard className="h-3 w-3" />
                      )}
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span
                      className={
                        expense.category === "Income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      ₹{expense.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(expense._id)}
                      className="rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="border-violet-100 dark:border-violet-800/30 rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg border-violet-200 hover:bg-violet-100/50 dark:border-violet-800 dark:hover:bg-violet-800/20 transition-all duration-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 hover:bg-red-700 focus:ring-red-600 transition-all duration-300"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
