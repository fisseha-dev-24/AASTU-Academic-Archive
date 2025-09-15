"use client"

"use client"

"use client"

"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Search, Shield, Users, FileText, Video, Star, CheckCircle, TrendingUp } from "lucide-react"
import Footer from "@/components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-14 w-14 drop-shadow-sm" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">AASTU Digital Archive</h1>
                <p className="text-sm text-gray-600 font-medium">Academic Document Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-blue-700 hover:text-blue-800 font-semibold transition-colors duration-200 hover:scale-105 transform"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  <Star className="h-4 w-4" />
                  <span>Trusted by 10,000+ Users</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  AASTU Digital
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600">
                    Archive System
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Centralized digital repository for Addis Ababa Science and Technology University. Access documents,
                  research papers, exam materials, and educational videos seamlessly with advanced search and collaboration tools.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg flex items-center justify-center space-x-3"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-center text-lg hover:shadow-lg transform hover:scale-105"
                >
                  Login to Account
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Free Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-gray-600">Always Available</span>
                </div>
              </div>
            </div>

            <div className="relative lg:min-h-[500px] flex items-center justify-center">
              <div className="relative z-10">
                <img
                  src="/aastu-university-building-modern-architecture-ethi.png"
                  alt="AASTU University Building"
                  className="rounded-3xl shadow-2xl border-8 border-white/20 backdrop-blur-sm max-w-full h-auto"
                />
              </div>
              
              {/* Floating Stats Cards - Repositioned */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200 z-20">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">10,000+</p>
                  <p className="text-sm text-gray-600 font-medium">Documents</p>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-2xl shadow-xl z-20">
                <div className="text-center">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-xs opacity-90">Active Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Star className="h-4 w-4" />
              <span>Why Choose AASTU Archive?</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Powerful Features for 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600"> Academic Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive archive system provides everything you need for academic research, document management,
              and collaborative learning with cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Advanced Search */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-fit mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Search className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Search</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Search documents by tags, department, year, author, and more. Find exactly what you need with powerful
                filtering options and AI-powered recommendations.
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            {/* Document Management */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 rounded-2xl w-fit mb-6 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                <BookOpen className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Document Management</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Upload, organize, and manage academic documents with approval workflows and version control for quality
                assurance and collaboration.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold text-sm">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            {/* Secure Access */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-amber-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-4 rounded-2xl w-fit mb-6 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                <Shield className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Access</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Role-based access control ensures appropriate permissions for students, teachers, department heads,
                deans, and administrators with enterprise-grade security.
              </p>
              <div className="flex items-center text-amber-600 font-semibold text-sm">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            {/* Collaborative Platform */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl w-fit mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <Users className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborative Platform</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Share documents, collaborate on research, and engage with the academic community through comments,
                ratings, and discussion forums.
              </p>
              <div className="flex items-center text-purple-600 font-semibold text-sm">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            {/* Video Content */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-red-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl w-fit mb-6 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300">
                <Video className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Video Content</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Access educational videos, lectures, and multimedia content with streaming capabilities and
                interactive features for enhanced learning experiences.
              </p>
              <div className="flex items-center text-red-600 font-semibold text-sm">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            {/* Analytics & Insights */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-4 rounded-2xl w-fit mb-6 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Track document usage, user engagement, and academic trends with comprehensive analytics and
                reporting tools for data-driven decisions.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold text-sm">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-800/90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Academic Experience?
                </span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Join thousands of students, teachers, and researchers who are already using AASTU Digital Archive
                to enhance their academic journey and contribute to the knowledge base.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group bg-white text-blue-700 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg flex items-center justify-center space-x-3"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/login"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-center text-lg hover:shadow-lg transform hover:scale-105"
              >
                Access Your Account
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-blue-100">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Free Access</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Always Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
