"use client"

"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"

interface Account {
  name: string
  email: string
  password: string
  role: string
  department: string
  studentId?: string
}

const accounts: Account[] = []

export default function AccountSwitcher() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      // For now, we'll use a simple approach - just show login instructions
      // In production, this would fetch from backend
      setAccounts([])
    } catch (error) {
      console.error('Error loading accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-blue-100 text-blue-800'
      case 'teacher':
        return 'bg-green-100 text-green-800'
      case 'department head':
        return 'bg-purple-100 text-purple-800'
      case 'college dean':
        return 'bg-orange-100 text-orange-800'
      case 'admin':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const copyAccount = (account: Account) => {
    const accountText = `Email: ${account.email}\nPassword: ${account.password}\nRole: ${account.role}\nDepartment: ${account.department}${account.studentId ? `\nStudent ID: ${account.studentId}` : ''}`
    navigator.clipboard.writeText(accountText)
    setCopiedAccount(account.email)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AASTU Archive System</h1>
        <p className="text-gray-600">Login to Access the System</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Welcome to AASTU Archive</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Access the digital archive system for Addis Ababa Science and Technology University. 
                Login with your credentials to access documents, manage content, and collaborate with the academic community.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-blue-900 mb-3">Test Credentials</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Email:</strong> Any registered user email</p>
                <p><strong>Password:</strong> test@123</p>
                <p><strong>Note:</strong> All test accounts use the same password</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Login to System
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/signup'}
              >
                Create Account
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Need help? Contact the system administrator</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
