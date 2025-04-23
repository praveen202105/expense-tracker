"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { User, Settings, LogOut, Menu, X,Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';

import Cookies from 'js-cookie';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DashboardShellProps {
  children?: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const openLogoutDialog = () => {
    setShowLogoutDialog(true)
  }
  

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); 
      setShowLogoutDialog(false)


      Cookies.remove('token');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false); 
   
    }
  };

  return (
    <div className="ml-8 flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-violet-50 dark:to-violet-950/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-violet-100 dark:border-violet-800/30">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Expense
            </span>
            <span>Manager</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-violet-600 transition-colors">
              Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8 border border-violet-200 dark:border-violet-800/30">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-violet-100 text-violet-800 dark:bg-violet-800/30 dark:text-violet-400">
                  JD
                </AvatarFallback>
              </Avatar>
              
              <Button
                    variant="ghost"
                    className="flex w-full justify-start items-center gap-2 text-sm font-medium hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                    onClick={openLogoutDialog}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                    Logout
                  </Button>
            </div>
          </nav>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] border-violet-100 dark:border-violet-800/30">
              <div className="flex flex-col gap-6 py-6">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Expense
                  </span>
                  <span>Manager</span>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                    onClick={openLogoutDialog}
                    disabled={isLoggingOut} // Disable the button during logout
                  >
                   {isLoggingOut ? (
                      // Display a spinner or loading indicator
                      <span className="loader"></span>
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    <span>Logout</span>
                    </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1 container py-8 md:py-10">
        <div className="grid gap-6">{children}</div>
      </main>
      <footer className="w-full border-t bg-background py-6 border-violet-100 dark:border-violet-800/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Expense
            </span>
            <span>Manager</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ExpenseManager. All rights reserved.
          </p>
        </div>
      </footer>
            {/* Logout Confirmation Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px] border-violet-100 dark:border-violet-800/30 shadow-lg shadow-violet-500/5">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to logout from your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="rounded-lg border-violet-200 hover:bg-violet-100/50 dark:border-violet-800 dark:hover:bg-violet-800/20 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg ml-4 bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
            >
              {isLoggingOut ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </span>
              ) : (
                "Yes, Logout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> 
    </div>
  )
}
