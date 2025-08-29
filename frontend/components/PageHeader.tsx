"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserProfileDropdown from "@/components/UserProfileDropdown"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backUrl?: string
  user: {
    id: number
    name: string
    email: string
    role: string
    department?: string
    student_id?: string
    department_id?: number
  } | null
  showBackButton?: boolean
  showLogo?: boolean
  children?: React.ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  backUrl,
  user,
  showBackButton = true,
  showLogo = true,
  children
}: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && backUrl && (
              <Link href={backUrl}>
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            {showLogo && (
              <img 
                src="/aastu-university-logo-blue-and-green.png" 
                alt="AASTU Logo" 
                className="h-10 w-10" 
              />
            )}
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {children}
            <UserProfileDropdown user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
