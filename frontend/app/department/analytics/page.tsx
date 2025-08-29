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
  const departmentStats = {
    totalTeachers: 24,
    totalDocuments: 1247,
    pendingApprovals: 18,
    approvedThisMonth: 156,
    rejectedThisMonth: 12,
    activeCourses: 45,
  }

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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.totalTeachers}</p>
                  <p className="text-xs text-green-600">+2 this month</p>
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
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.totalDocuments}</p>
                  <p className="text-xs text-green-600">+156 this month</p>
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
                  <p className="text-2xl font-bold text-gray-900">92.5%</p>
                  <p className="text-xs text-green-600">+2.1% this month</p>
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
                  <p className="text-2xl font-bold text-gray-900">52</p>
                  <p className="text-xs text-green-600">+5 this month</p>
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
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Prof. Michael Chen</p>
                    <p className="text-sm text-gray-600">Machine Learning</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">67</p>
                    <p className="text-xs text-gray-600">documents</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Prof. Lisa Anderson</p>
                    <p className="text-sm text-gray-600">Computer Networks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">53</p>
                    <p className="text-xs text-gray-600">documents</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Database Systems</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">45</p>
                    <p className="text-xs text-gray-600">documents</p>
                  </div>
                </div>
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
                  <span className="text-lg font-bold text-green-600">+{departmentStats.approvedThisMonth}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 " />
                    <span className="font-medium">Documents Rejected</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">-{departmentStats.rejectedThisMonth}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-yellow-600 " />
                    <span className="font-medium">Pending Reviews</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{departmentStats.pendingApprovals}</span>
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
      </div>
      
      <Footer />
    </div>
  )
}
