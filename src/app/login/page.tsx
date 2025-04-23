"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { toast } from "sonner"
import { loginUser } from "../lib/auth"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Cookies from "js-cookie"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
  
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      Cookies.set("token", data.token, {
        expires: 7, 
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Lax', // Helps protect against CSRF
      });
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }


      toast.success("Login successful!", {
        description: "Welcome back!",
      });
  
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-violet-50 dark:to-violet-950/20">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account and manage your finances
          </p>
        </div>
        <Card className="border-violet-100 dark:border-violet-800/30 shadow-lg shadow-violet-500/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 rounded-lg border-violet-100 focus:border-violet-300 focus:ring-violet-300 dark:border-violet-800/30 dark:focus:border-violet-700 dark:focus:ring-violet-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="text-xs text-violet-600 hover:text-violet-700 hover:underline underline-offset-4 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 rounded-lg border-violet-100 focus:border-violet-300 focus:ring-violet-300 dark:border-violet-800/30 dark:focus:border-violet-700 dark:focus:ring-violet-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full mt-4 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-violet-500/25"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-violet-600 hover:text-violet-700 hover:underline underline-offset-4 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
