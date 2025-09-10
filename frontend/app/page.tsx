"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Search, Shield, Users, FileText, Video } from "lucide-react"
import Footer from "@/components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-14 w-14 mr-4" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-blue-800 bg-clip-text text-transparent">AASTU Academic Archive</h1>
                <p className="text-sm text-gray-600 font-medium">University for Industry - Digital Innovation</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-blue-800 hover:text-blue-900 font-semibold transition-colors duration-200">
                Sign In
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2.5 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-amber-600 via-blue-800 to-amber-700 bg-clip-text text-transparent">Academic Journey</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                  Discover, access, and collaborate on thousands of academic resources. From research papers to lecture materials, 
                  everything you need for academic excellence is at your fingertips.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 text-lg"
                >
                  <span>Start Exploring</span>
                  <ArrowRight className="h-6 w-6" />
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-blue-800 text-blue-800 hover:bg-blue-50 font-semibold py-4 px-10 rounded-xl transition-all duration-300 text-center text-lg"
                >
                  Access Your Account
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/aastu-university-building-modern-architecture-ethi.png"
                  alt="AASTU University Building"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-amber-200">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-blue-800 bg-clip-text text-transparent">15,000+</p>
                  <p className="text-sm text-gray-600 font-semibold">Academic Resources</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">Innovative Tools for Academic Success</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Experience the future of academic collaboration with our cutting-edge platform designed to enhance 
              learning, research, and knowledge sharing across the university community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Advanced Search */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl w-fit mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Search className="h-10 w-10 text-blue-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Search Engine</h3>
              <p className="text-gray-700 leading-relaxed">
                Discover resources instantly with AI-powered search across departments, authors, and content types. 
                Find exactly what you need with intelligent filtering and recommendations.
              </p>
            </div>

            {/* Document Management */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 group">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-4 rounded-xl w-fit mb-6 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                <BookOpen className="h-10 w-10 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Document Hub</h3>
              <p className="text-gray-700 leading-relaxed">
                Seamlessly upload, organize, and manage academic materials with automated categorization, 
                version control, and collaborative editing capabilities.
              </p>
            </div>

            {/* Secure Access */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 group">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-xl w-fit mb-6 group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                <Shield className="h-10 w-10 text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-700 leading-relaxed">
                Advanced role-based access control with multi-factor authentication ensures your academic 
                resources are protected while maintaining easy access for authorized users.
              </p>
            </div>

            {/* Collaborative Platform */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl w-fit mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Users className="h-10 w-10 text-blue-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Academic Community</h3>
              <p className="text-gray-700 leading-relaxed">
                Connect with peers, mentors, and experts across departments. Share knowledge, collaborate on projects, 
                and build lasting academic relationships.
              </p>
            </div>

            {/* Analytics & Insights */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 group">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-4 rounded-xl w-fit mb-6 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                <FileText className="h-10 w-10 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Data-Driven Insights</h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive analytics dashboard providing real-time insights into resource usage, 
                academic trends, and performance metrics for informed decision-making.
              </p>
            </div>

            {/* Multimedia Support */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 group">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-xl w-fit mb-6 group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                <Video className="h-10 w-10 text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rich Media Library</h3>
              <p className="text-gray-700 leading-relaxed">
                Support for diverse content formats including interactive videos, presentations, 
                3D models, and virtual reality experiences for immersive learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-800 via-blue-900 to-amber-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Ready to Revolutionize Your Learning?
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Join over 15,000 AASTU students, faculty, and researchers who are already transforming their academic 
              experience with our cutting-edge digital platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link
                href="/signup"
                className="bg-white text-blue-800 hover:bg-gray-50 font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 text-lg"
              >
                <span>Join the Community</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
              <Link
                href="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-800 font-bold py-4 px-10 rounded-xl transition-all duration-300 text-lg"
              >
                Access Your Account
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
