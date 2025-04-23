import type { Expense, ExpenseApiResponse } from "./types"
import { getCurrentUser } from "./auth"

const BASE_URL = "api/expenses"

function getAuthHeader() {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getUserExpenses(): Promise<ExpenseApiResponse> {
    try {
        const authHeader = getAuthHeader(); // Get the auth header
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(authHeader.Authorization ? { Authorization: authHeader.Authorization } : {}),
        };

        const res = await fetch(BASE_URL, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user expenses");
        }

        const data: ExpenseApiResponse = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return { income: 0, expense: 0, expenses: [] }; // Return a default response in case of error
    }
}

export async function addExpense(
    data: Omit<Expense, "_id" | "createdAt" | "userId" | "__v">
): Promise<Expense> {
    const authHeader = getAuthHeader(); // Get the auth header
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(authHeader.Authorization ? { Authorization: authHeader.Authorization } : {}),
    };

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to add expense");
    }

    const newExpense: Expense = await res.json();
    return newExpense;
}


export async function deleteExpense(id: string): Promise<void> {
    const authHeader = getAuthHeader(); // Get the auth header
    const headers: HeadersInit = authHeader.Authorization
        ? { Authorization: authHeader.Authorization }
        : {}; // Only add Authorization if it's available

    const res = await fetch(`${BASE_URL}?id=${id}`, {
        method: "DELETE",
        headers: headers,
    })

    if (!res.ok) {
        throw new Error("Failed to delete expense")
    }
}

