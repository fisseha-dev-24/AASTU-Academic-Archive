"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Download, ArrowLeft, FileText, Calendar, BarChart3, PieChart } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/PageHeader"

export default function ReportsInsights() {
  const [reportType, setReportType] = useState("monthly")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [user, setUser] = useState<any>(null)

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

  const availableReports = [
    {
      id: 1,
      title: "Monthly Department Performance",
      description: "Comprehensive overview of department activities and metrics",
      type: "Performance",
      lastGenerated: "2024-01-15",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Faculty Activity Report",
      description: "Detailed analysis of faculty document submissions and approvals",
      type: "Faculty",
      lastGenerated: "2024-01-14",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Document Approval Analytics",
      description: "Statistical analysis of document approval patterns and trends",
      type: "Analytics",
      lastGenerated: "2024-01-13",
      size: "3.1 MB",
    },
    {
      id: 4,
      title: "Course Management Summary",
      description: "Overview of course enrollment, materials, and performance",
      type: "Academic",
      lastGenerated: "2024-01-12",
      size: "2.7 MB",
    },
  ]

  const reportMetrics = {
    totalReports: 24,
    reportsThisMonth: 8,
    avgGenerationTime: "2.3 minutes",
    mostRequestedType: "Performance Reports",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Reports"
        subtitle="Generate department reports"
        backUrl="/department/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Generation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 " />
              Generate New Report
            </CardTitle>
            <CardDescription>Create custom reports based on your requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Performance</SelectItem>
                    <SelectItem value="faculty">Faculty Activity</SelectItem>
                    <SelectItem value="analytics">Document Analytics</SelectItem>
                    <SelectItem value="academic">Academic Overview</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <BarChart3 className="h-4 w-4 " />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{reportMetrics.totalReports}</p>
              <p className="text-sm text-gray-600">Total Reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{reportMetrics.reportsThisMonth}</p>
              <p className="text-sm text-gray-600">This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{reportMetrics.avgGenerationTime}</p>
              <p className="text-sm text-gray-600">Avg. Generation Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <PieChart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">Performance</p>
              <p className="text-sm text-gray-600">Most Requested</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-emerald-600 " />
              Recent Reports
            </CardTitle>
            <CardDescription>Previously generated reports available for download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline">{report.type}</Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.lastGenerated}
                      </span>
                      <span className="text-xs text-gray-500">{report.size}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 " />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
