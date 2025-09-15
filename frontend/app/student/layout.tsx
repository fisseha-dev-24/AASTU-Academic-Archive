"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { AppSidebar, AppSidebarProvider } from "@/components/AppSidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Bell, Search, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string | { name: string }
  student_id?: string
  department_id?: number
  avatar?: string
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <AppSidebarProvider>
        <AppSidebar user={user} role="student" />
        <SidebarInset className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Top Header - Simplified */}
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm">
            <SidebarTrigger className="h-8 w-8" />
            
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <img 
                  src="/aastu-university-logo-blue-and-green.png" 
                  alt="AASTU Logo" 
                  className="h-10 w-10" 
                />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">AASTU Academic Archive</h1>
                  <p className="text-xs text-gray-500">Student Portal</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </AppSidebarProvider>
    </ProtectedRoute>
  )
}
