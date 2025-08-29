"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import Footer from "@/components/Footer"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "student",
  })

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get('registered') === 'true') {
      setShowSuccessMessage(true)
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }

    // Auto-fill form if data is available in localStorage
    const savedEmail = localStorage.getItem('login_email')
    const savedPassword = localStorage.getItem('login_password')
    const savedRole = localStorage.getItem('login_role')

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        userType: savedRole || "student",
      })
      
      // Clear the saved data
      localStorage.removeItem('login_email')
      localStorage.removeItem('login_password')
      localStorage.removeItem('login_role')
    }
  }, [searchParams])

  const clearError = () => {
    setErrorMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password,
      })

      if (response.success && response.token) {
        // Use the auth context to handle login
        if (response.user && typeof response.user === 'object') {
          // Ensure user data is properly formatted
          const userData = {
            id: response.user.id || 0,
            name: response.user.name || 'Unknown User',
            email: response.user.email || '',
            role: response.user.role || 'student',
            student_id: response.user.student_id,
            department_id: response.user.department_id,
            created_at: response.user.created_at,
            updated_at: response.user.updated_at
          }
          login(response.token, userData)
        } else {
          console.error('Invalid user data in response:', response.user)
          setErrorMessage('Invalid user data received from server')
          return
        }
        
        // Navigate to the appropriate dashboard based on user role
        if (response.redirect_url) {
          router.push(response.redirect_url)
        } else {
          // Fallback based on user type selection
          switch (formData.userType) {
            case "student":
              router.push("/student/dashboard")
              break
            case "teacher":
              router.push("/teacher/dashboard")
              break
            case "department_head":
              router.push("/department/dashboard")
              break
            case "college_dean":
              router.push("/dean/dashboard")
              break
            case "admin":
              router.push("/admin/dashboard")
              break
            default:
              router.push("/student/dashboard")
          }
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error)
      // Handle different types of error messages
      let errorMsg = "Invalid email or password. Please try again."
      if (error.message) {
        if (typeof error.message === 'string') {
          errorMsg = error.message
        } else if (typeof error.message === 'object') {
          errorMsg = JSON.stringify(error.message)
        }
      }
      setErrorMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12" />
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">AASTU Archive</h1>
                <p className="text-sm text-gray-600">Digital Document System</p>
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to access your account</p>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Registration Successful!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your account has been created. Please sign in with your credentials.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-sm font-medium text-red-800">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="aastu-card">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Login as</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="aastu-input"
                  disabled={isLoading}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="department_head">Department Head</option>
                  <option value="college_dean">College Dean</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearError(); }}
                    className="aastu-input pl-10"
                    placeholder="your.email@aastu.edu.et"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearError(); }}
                    className="aastu-input pl-10 pr-10"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full aastu-button-primary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Having trouble? Contact{" "}
              <a href="mailto:support@aastu.edu.et" className="text-blue-600 hover:text-blue-500">
                support@aastu.edu.et
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
