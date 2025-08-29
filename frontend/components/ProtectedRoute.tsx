"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // If roles are specified and user doesn't have access
      if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        const roleRedirects: { [key: string]: string } = {
          'student': '/student/dashboard',
          'teacher': '/teacher/dashboard',
          'department_head': '/department/dashboard',
          'college_dean': '/dean/dashboard',
          'admin': '/admin/dashboard',
        }
        
        const redirectUrl = roleRedirects[user.role] || '/login'
        router.push(redirectUrl)
        return
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null
  }

  // If roles are specified and user doesn't have access, don't render children
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null
  }

  // User is authenticated and has proper access
  return <>{children}</>
}
