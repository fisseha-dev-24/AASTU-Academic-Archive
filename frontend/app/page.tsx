"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Search, Shield, Users, FileText, Video } from "lucide-react"
import Footer from "@/components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AASTU Digital Archive</h1>
                <p className="text-sm text-gray-600">Academic Document Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AASTU Digital
                  <span className="block text-transparent bg-clip-text aastu-gradient">Archive System</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Centralized digital repository for Addis Ababa Science and Technology University. Access documents,
                  research papers, exam materials, and educational videos seamlessly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="aastu-button-primary flex items-center justify-center space-x-2 text-lg py-3 px-8"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-center"
                >
                  Login to Account
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="/aastu-university-building-modern-architecture-ethi.png"
                alt="AASTU University Building"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div>
                  <p className="font-semibold text-gray-900">10,000+</p>
                  <p className="text-sm text-gray-600">Documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Powerful Features for Academic Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive archive system provides everything you need for academic research, document management,
              and collaborative learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Advanced Search */}
            <div className="aastu-card group hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-blue-200 transition-colors">
                <Search className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Search documents by tags, department, year, author, and more. Find exactly what you need with powerful
                filtering options.
              </p>
            </div>

            {/* Document Management */}
            <div className="aastu-card group hover:shadow-lg transition-shadow duration-300">
              <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-emerald-200 transition-colors">
                <BookOpen className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Document Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload, organize, and manage academic documents with approval workflows and version control for quality
                assurance.
              </p>
            </div>

            {/* Secure Access */}
            <div className="aastu-card group hover:shadow-lg transition-shadow duration-300">
              <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-amber-200 transition-colors">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Role-based access control ensures appropriate permissions for students, teachers, department heads,
                deans, and administrators.
              </p>
            </div>

            {/* Collaborative Platform */}
            <div className="aastu-card group hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect students, faculty, and administrators in a unified platform for seamless academic collaboration.
              </p>
            </div>

            {/* Analytics & Insights */}
            <div className="aastu-card group hover:shadow-lg transition-shadow duration-300">
              <div className="bg-rose-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-rose-200 transition-colors">
                <FileText className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Track document usage, department statistics, and system analytics for informed decision-making.
              </p>
            </div>

            {/* Multimedia Support */}
            <div className="aastu-card group hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-indigo-200 transition-colors">
                <Video className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multimedia Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Support for various file types including documents, videos, presentations, and interactive educational
                materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 aastu-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Transform Your Academic Experience?</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of AASTU students and faculty members who are already using our digital archive system to
              enhance their academic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-700 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
