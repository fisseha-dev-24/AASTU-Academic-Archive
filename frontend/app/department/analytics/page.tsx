"use client"

"use client"

"use client"

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Download,
  ArrowLeft,
  Users,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { apiClient } from "@/lib/api"

export default function DepartmentAnalytics() {
  const [user, setUser] = useState<{
    id: number
    name: string
    email: string
    role: string
    department?: string
    student_id?: string
    department_id?: number
  } | null>(null)

  // Load user data
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
  const [departmentStats, setDepartmentStats] = useState({
    total_teachers: 0,
    total_documents: 0,
    pending_approvals: 0,
    approved_this_month: 0,
    rejected_this_month: 0,
    active_courses: 0,
    total_courses: 0,
    approval_rate: 0,
    top_teachers: [] as Array<{
      id: number;
      name: string;
      email: string;
      approved_documents: number;
    }>,
    monthly_stats: {
      approved: 0,
      rejected: 0,
      pending: 0
    }
  })
  const [loading, setLoading] = useState(true)

  // Load department analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getDepartmentAnalytics()
        if (response.success) {
          setDepartmentStats(response.data)
        } else {
          console.error('Failed to load analytics:', response.message)
        }
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadAnalytics()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Department Analytics"
        subtitle="Performance insights and reports"
        backUrl="/department/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading department analytics...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.total_teachers}</p>
                  <p className="text-xs text-green-600">Active faculty</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.total_documents}</p>
                  <p className="text-xs text-green-600">Total uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.approval_rate}%</p>
                  <p className="text-xs text-green-600">Approval rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Documents/Teacher</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.active_courses}</p>
                  <p className="text-xs text-green-600">Active courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 " />
                Document Approval Trends
              </CardTitle>
              <CardDescription>Monthly approval statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Showing approval trends over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 text-emerald-600 " />
                Document Types Distribution
              </CardTitle>
              <CardDescription>Breakdown by document category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Pie chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Course materials, research papers, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 " />
                Teacher Performance
              </CardTitle>
              <CardDescription>Top performing faculty members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.top_teachers.length > 0 ? (
                  departmentStats.top_teachers.map((teacher, index) => (
                    <div key={teacher.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{teacher.approved_documents}</p>
                        <p className="text-xs text-gray-600">approved documents</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No teacher data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 text-orange-600 " />
                Monthly Statistics
              </CardTitle>
              <CardDescription>Current month performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 " />
                    <span className="font-medium">Documents Approved</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">+{departmentStats.monthly_stats.approved}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 " />
                    <span className="font-medium">Documents Rejected</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">-{departmentStats.monthly_stats.rejected}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-yellow-600 " />
                    <span className="font-medium">Pending Reviews</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{departmentStats.monthly_stats.pending}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 " />
                    <span className="font-medium">Average Response Time</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">2.3 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
