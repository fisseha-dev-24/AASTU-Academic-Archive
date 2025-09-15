"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, AlertCircle, Calendar, Users, BookOpen, TrendingUp } from "lucide-react"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

export default function DepartmentReports() {
  const [user, setUser] = useState<{
    id: number
    name: string
    email: string
    role: string
    department?: string
    student_id?: string
    department_id?: number
  } | null>(null)

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Department Reports"
        subtitle="Generate and download department reports"
        backUrl="/department/dashboard"
        user={user}
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Department Reports</h1>
              <p className="text-gray-600 mt-1">Generate comprehensive reports for your department</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Not Implemented Notice */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Reports Feature Not Implemented</h3>
                <p className="text-orange-700 mb-4">
                  The department reports functionality is currently not implemented due to time constraints. 
                  This feature would include:
                </p>
                <ul className="list-disc list-inside text-orange-700 space-y-1 mb-4">
                  <li>Document approval statistics reports</li>
                  <li>Teacher performance reports</li>
                  <li>Course enrollment reports</li>
                  <li>Department analytics reports</li>
                  <li>CSV export functionality</li>
                  <li>PDF report generation</li>
                </ul>
                <p className="text-orange-600 text-sm">
                  This feature can be implemented in future iterations with proper backend support for data aggregation and export functionality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Document Approval Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Generate detailed reports on document approval rates, processing times, and trends.
              </p>
              <Button disabled className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Faculty Performance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Analyze teacher performance, document uploads, and engagement metrics.
              </p>
              <Button disabled className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Course Analytics Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track course offerings, enrollment patterns, and academic performance.
              </p>
              <Button disabled className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Department Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Comprehensive department overview with key performance indicators.
              </p>
              <Button disabled className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                Monthly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monthly activity summary with document approvals and faculty activity.
              </p>
              <Button disabled className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Custom Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create custom reports with specific date ranges and filters.
              </p>
              <Button disabled className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Required Backend Features:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Data aggregation endpoints for various report types</li>
                  <li>CSV export functionality with proper formatting</li>
                  <li>PDF generation using libraries like DomPDF or similar</li>
                  <li>Report scheduling and automated generation</li>
                  <li>Data filtering and date range selection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Frontend Features:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Report generation forms with filters</li>
                  <li>Progress indicators for long-running reports</li>
                  <li>Download management and history</li>
                  <li>Report preview functionality</li>
                  <li>Email report delivery options</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}