"use client"

"use client"

"use client"

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowRight, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log("Password reset request for:", email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12" />
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">AASTU Archive</h1>
                <p className="text-sm text-gray-600">Digital Document System</p>
              </div>
            </Link>
          </div>

          <div className="aastu-card text-center">
            <div className="bg-emerald-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">Didn't receive the email? Check your spam folder or try again.</p>
            <div className="space-y-3">
              <button onClick={() => setIsSubmitted(false)} className="w-full aastu-button-secondary">
                Try Different Email
              </button>
              <Link href="/login" className="block w-full text-center text-blue-600 hover:text-blue-500">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">Enter your email to receive a reset link</p>
        </div>

        {/* Reset Form */}
        <div className="aastu-card">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="aastu-input pl-10"
                  placeholder="your.email@aastu.edu.et"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full aastu-button-primary flex items-center justify-center space-x-2 py-3"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Still having trouble? Contact{" "}
            <a href="mailto:support@aastu.edu.et" className="text-blue-600 hover:text-blue-500">
              support@aastu.edu.et
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
