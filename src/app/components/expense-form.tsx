"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { toast } from "sonner"
import { addExpense } from "../lib/expenses"
import type { Expense } from "../lib/types"
import { CreditCard, IndianRupee } from "lucide-react"

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void
  onCancel: () => void
}

export function ExpenseForm({ onAddExpense, onCancel }: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    category: "Expense",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    const { amount, category, description } = formData
  console.log("ff ",formData);
  
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.log("dd");
      
      toast("Invalid amount", {
        description: "Please enter a valid amount greater than zero.",
      })
      return
    }
  
    try {
      setIsLoading(true)
  
      const payload = {
        amount: Number(amount),
        category: category as "Income" | "Expense",
        description,
      }
  console.log("pa",payload);
  
      const expense = await addExpense(payload)
  
      onAddExpense(expense)
      toast("Transaction added", {
        description: "Your transaction has been added successfully.",
      })
    } catch (error) {
      toast("Failed to add transaction", {
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          Amount *
        </Label>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="amount"
            name="amount"
            placeholder="0.00"
            required
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            className="pl-10 rounded-lg border-violet-100 focus:border-violet-300 focus:ring-violet-300 dark:border-violet-800/30 dark:focus:border-violet-700 dark:focus:ring-violet-700"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Category *</Label>
        <RadioGroup value={formData.category} onValueChange={handleCategoryChange} className="flex space-x-4">
          <div className="flex items-center space-x-2 rounded-lg border border-violet-100 dark:border-violet-800/30 p-3 transition-all duration-200 hover:bg-violet-50 dark:hover:bg-violet-900/10 cursor-pointer">
            <RadioGroupItem
              value="Income"
              id="income"
              className="text-green-600 border-green-600 focus:ring-green-600"
            />
            <Label htmlFor="income" className="font-normal flex items-center cursor-pointer">
              <IndianRupee className="h-4 w-4 mr-2 text-green-600" />
              Income
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border border-violet-100 dark:border-violet-800/30 p-3 transition-all duration-200 hover:bg-violet-50 dark:hover:bg-violet-900/10 cursor-pointer">
            <RadioGroupItem value="Expense" id="expense" className="text-red-600 border-red-600 focus:ring-red-600" />
            <Label htmlFor="expense" className="font-normal flex items-center cursor-pointer">
              <CreditCard className="h-4 w-4 mr-2 text-red-600" />
              Expense
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter a description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="min-h-[100px] rounded-lg border-violet-100 focus:border-violet-300 focus:ring-violet-300 dark:border-violet-800/30 dark:focus:border-violet-700 dark:focus:ring-violet-700 resize-none"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-lg border-violet-200 hover:bg-violet-100/50 dark:border-violet-800 dark:hover:bg-violet-800/20 transition-all duration-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-violet-500/25"
        >
          {isLoading ? "Adding..." : "Add Transaction"}
        </Button>
      </div>
    </form>
  )
}
