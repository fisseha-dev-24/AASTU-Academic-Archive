"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Building2,
  GraduationCap,
  Target,
  ArrowLeft,
  Loader2,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
}

interface DepartmentAnalytics {
  id: number
  name: string
  teacher_count: number
  student_count: number
  total_documents: number
  pending_documents: number
  approved_documents: number
  approval_rate: number
}

interface InstitutionalReports {
  document_activity: {
    total_uploads: number
    total_approvals: number
    approval_rate: number
  }
  user_activity: {
    new_users: number
    active_users: number
  }
  department_performance: Array<{
    department: string
    total_documents: number
    approved_documents: number
    approval_rate: number
  }>
}

export default function CollegeOverview() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departmentAnalytics, setDepartmentAnalytics] = useState<DepartmentAnalytics[]>([])
  const [institutionalReports, setInstitutionalReports] = useState<InstitutionalReports | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
    loadOverviewData()
  }, [])

  const loadUserData = () => {
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
  }

  const loadOverviewData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Load department analytics and institutional reports in parallel
      const [analyticsResponse, reportsResponse] = await Promise.all([
        apiClient.getDeanDepartmentAnalytics(),
        apiClient.getDeanInstitutionalReports()
      ])

      if (analyticsResponse.success) {
        setDepartmentAnalytics(analyticsResponse.data)
      }

      if (reportsResponse.success) {
        setInstitutionalReports(reportsResponse.data)
      }
    } catch (error) {
      console.error('Error loading overview data:', error)
      setError('Failed to load overview data')
      toast.error('Failed to load overview data')
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (rate >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>
  }

  const selectedDeptData = selectedDepartment 
    ? departmentAnalytics.find(dept => dept.name === selectedDepartment)
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading overview data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="College Overview"
        subtitle="Comprehensive analytics and performance metrics"
        backUrl="/dean/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dean/dashboard">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="shadow-lg border-0 bg-red-50 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Institutional Overview Cards */}
        {institutionalReports && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {institutionalReports.document_activity.total_uploads.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Approvals</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {institutionalReports.document_activity.total_approvals.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {institutionalReports.document_activity.approval_rate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {institutionalReports.user_activity.active_users.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Department Performance */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Department Performance Overview
            </CardTitle>
            <CardDescription>
              Performance metrics and analytics for each department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentAnalytics.map((dept) => (
                    <tr 
                      key={dept.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedDepartment === dept.name ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedDepartment(selectedDepartment === dept.name ? null : dept.name)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dept.teacher_count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dept.student_count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dept.total_documents}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dept.pending_documents}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getPerformanceColor(dept.approval_rate)}`}>
                            {dept.approval_rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPerformanceBadge(dept.approval_rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Selected Department Details */}
        {selectedDeptData && (
          <Card className="shadow-lg border-0 bg-white mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                {selectedDeptData.name} - Detailed Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedDeptData.teacher_count}</p>
                  <p className="text-sm text-gray-600">Faculty Members</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedDeptData.student_count}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedDeptData.total_documents}</p>
                  <p className="text-sm text-gray-600">Total Documents</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Document Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approved:</span>
                      <span className="text-sm font-medium text-green-600">{selectedDeptData.approved_documents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="text-sm font-medium text-yellow-600">{selectedDeptData.pending_documents}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approval Rate:</span>
                      <span className={`text-sm font-medium ${getPerformanceColor(selectedDeptData.approval_rate)}`}>
                        {selectedDeptData.approval_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      {getPerformanceBadge(selectedDeptData.approval_rate)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access common administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dean/documents">
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
              </Link>
              <Link href="/dean/faculty">
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Faculty
                </Button>
              </Link>
              <Button className="w-full" variant="outline" onClick={loadOverviewData}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Link href="/dean/dashboard">
                <Button className="w-full" variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
