"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Eye, Download, Clock, MapPin, Star, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
}

export default function AcademicCalendarPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading academic calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Academic Calendar</h1>
                <p className="text-gray-600 mt-1">View and download the academic calendar</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Academic Year 2024-2025
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Calendar Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Academic Calendar 2024-2025
            </CardTitle>
            <p className="text-gray-600">View the complete academic calendar for the current academic year</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Calendar Preview */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Calendar PDF</h3>
                  <p className="text-gray-600 mb-4">
                    The academic calendar contains important dates including semester start/end dates, 
                    exam periods, holidays, and registration deadlines.
                  </p>
                  
                  {/* Calendar Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Fall Semester</h4>
                      <p className="text-sm text-gray-600">September 2 - December 20, 2024</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Spring Semester</h4>
                      <p className="text-sm text-gray-600">January 13 - May 2, 2025</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Summer Session</h4>
                      <p className="text-sm text-gray-600">May 19 - July 11, 2025</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        // Open calendar in new tab
                        window.open('/academic-calendar-2024-2025.pdf', '_blank')
                      }}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      View Calendar
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        // Download calendar
                        const link = document.createElement('a')
                        link.href = '/academic-calendar-2024-2025.pdf'
                        link.download = 'AASTU-Academic-Calendar-2024-2025.pdf'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Important Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Important Dates - Fall 2024</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Registration Opens</span>
                      <span className="text-sm text-gray-600">August 15, 2024</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Classes Begin</span>
                      <span className="text-sm text-gray-600">September 2, 2024</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Midterm Exams</span>
                      <span className="text-sm text-gray-600">October 21-25, 2024</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Final Exams</span>
                      <span className="text-sm text-gray-600">December 16-20, 2024</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Important Dates - Spring 2025</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Registration Opens</span>
                      <span className="text-sm text-gray-600">December 15, 2024</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Classes Begin</span>
                      <span className="text-sm text-gray-600">January 13, 2025</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Midterm Exams</span>
                      <span className="text-sm text-gray-600">March 3-7, 2025</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Final Exams</span>
                      <span className="text-sm text-gray-600">April 28 - May 2, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}