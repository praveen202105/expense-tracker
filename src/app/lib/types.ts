export interface Expense {
    _id: string
    userId: string
    amount: number
    category: "Income" | "Expense"
    description: string
    createdAt: string
    __v?: number
}

export interface User {
    id: string
    name: string
    email: string
}

export interface AuthFormData {
    name?: string
    email: string
    password: string
}

export interface ExpenseApiResponse {
    income: number
    expense: number
    expenses: Expense[]
}
