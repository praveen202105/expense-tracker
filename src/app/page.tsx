
"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { ArrowRight, BarChart3, CreditCard, DollarSign, PieChart } from 'lucide-react'
import Cookies from "js-cookie"

export default function Home() {
  const router = useRouter()
  

  useEffect(() => {
    const token = Cookies.get("token")

    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-background/80">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Expense</span>
            <span>Manager</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="rounded-full">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background via-background to-background/80">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-800 dark:bg-violet-800/20 dark:text-violet-500">
                  Financial Freedom Starts Here
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Manage Your Finances with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Track your income and expenses, analyze your spending habits, and take control of your financial
                    future with our beautiful and intuitive expense manager.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="rounded-full border-violet-200 hover:bg-violet-100/50 dark:border-violet-800 dark:hover:bg-violet-800/20 transition-all duration-300">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square rounded-2xl bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-background p-6 shadow-xl transition-all duration-300 hover:shadow-violet-500/10">
                  <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-sm dark:bg-black/40"></div>
                  <div className="relative z-10 h-full rounded-xl bg-white/90 dark:bg-gray-900/90 p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Monthly Summary</h3>
                        <span className="text-sm text-muted-foreground">April 2025</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 transition-all duration-300 hover:shadow-md">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-2">
                              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-sm text-muted-foreground">Income</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">$5,240.00</p>
                        </div>
                        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 transition-all duration-300 hover:shadow-md">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-red-100 dark:bg-red-800/30 p-2">
                              <CreditCard className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <p className="text-sm text-muted-foreground">Expenses</p>
                          </div>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">$3,180.00</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-4 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-violet-100 dark:bg-violet-800/30 p-2">
                            <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                          <p className="text-sm text-muted-foreground">Balance</p>
                        </div>
                        <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mt-2">$2,060.00</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                        </div>
                        <p className="text-xs text-muted-foreground">60% of monthly budget spent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-violet-50 to-background dark:from-violet-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <span className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-800 dark:bg-violet-800/20 dark:text-violet-500">
                Powerful Features
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Everything You Need
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Manage your personal finances effectively with our comprehensive suite of tools
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-xl border border-violet-100 dark:border-violet-800/30 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-violet-500/5 hover:-translate-y-1">
                <div className="rounded-full bg-violet-100 dark:bg-violet-800/30 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-violet-600 dark:text-violet-400"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">User Authentication</h3>
                <p className="text-center text-muted-foreground">
                  Secure login and registration with email and password protection for your financial data
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-xl border border-violet-100 dark:border-violet-800/30 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-violet-500/5 hover:-translate-y-1">
                <div className="rounded-full bg-violet-100 dark:bg-violet-800/30 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-violet-600 dark:text-violet-400"
                  >
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Expense Management</h3>
                <p className="text-center text-muted-foreground">
                  Add, delete, and view all your income and expenses with an intuitive and beautiful interface
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-xl border border-violet-100 dark:border-violet-800/30 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-violet-500/5 hover:-translate-y-1">
                <div className="rounded-full bg-violet-100 dark:bg-violet-800/30 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-violet-600 dark:text-violet-400"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Export to PDF</h3>
                <p className="text-center text-muted-foreground">
                  Generate and download detailed expense reports in PDF format for your records and analysis
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-violet-50 dark:from-background dark:to-violet-950/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-800 dark:bg-violet-800/20 dark:text-violet-500">
                  Why Choose Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Beautiful Analytics at Your Fingertips
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Our expense manager provides beautiful visualizations and insights to help you understand your spending habits and make better financial decisions.
                </p>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Real-time financial tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Beautiful, intuitive interface</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Secure and private data storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Handles large datasets with ease</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Link href="/register">
                    <Button className="gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25">
                      Start Managing Your Finances
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square rounded-2xl bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-background p-6 shadow-xl transition-all duration-300 hover:shadow-violet-500/10">
                  <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-sm dark:bg-black/40"></div>
                  <div className="relative z-10 h-full rounded-xl bg-white/90 dark:bg-gray-900/90 p-6 shadow-sm flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <PieChart className="w-48 h-48 text-violet-500 opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Expense</span>
            <span>Manager</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ExpenseManager. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors duration-200">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors duration-200">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-violet-600 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
