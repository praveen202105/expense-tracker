import type { AuthFormData } from "./types"



// Mock authentication state
let currentUser: string | null = null



export async function loginUser(data: AuthFormData): Promise<string> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const user = localStorage.getItem("token")

    // In a real app, you would verify the password here
    // const user = users.find((user) => user.email === data.email)
    if (!user) {
        throw new Error("Invalid email or password")
    }

    currentUser = user
    return user
}

export async function logoutUser(): Promise<void> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    currentUser = null
}

export async function getCurrentUser(): Promise<string | null> {
    // In a real app, this would check the session/token
    // const token = localStorage.getItem("token")

    return currentUser
}
