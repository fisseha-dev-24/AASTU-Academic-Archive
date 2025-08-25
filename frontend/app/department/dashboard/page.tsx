"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  BarChart3,
  Activity,
  Download,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface UserInfo {
  id: number
  name: string
  email: string
  role: string
  student_id?: string
  department_id?: number
  department?: {
    id: number
    name: string
  }
}

export default function DepartmentHeadDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [welcomeMessage, setWelcomeMessage] = useState("")

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('user_info')
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo)
      setUserInfo(user)
      
      // Generate welcome message based on time of day
      const hour = new Date().getHours()
      let timeGreeting = ""
      if (hour < 12) {
        timeGreeting = "Good morning"
      } else if (hour < 17) {
        timeGreeting = "Good afternoon"
      } else {
        timeGreeting = "Good evening"
      }
      
      // Extract first name from full name
      const firstName = user.name ? user.name.split(' ')[0] : 'Department Head'
      setWelcomeMessage(`${timeGreeting}, ${firstName}! Welcome back to your dashboard.`)
    }
  }, [])

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return "DH"
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Get department name from user info
  const getDepartmentName = () => {
    if (userInfo?.department?.name) {
      return userInfo.department.name
    }
    // Fallback based on email or default
    if (userInfo?.email?.includes('computer')) {
      return "Computer Science Department"
    }
    return "Computer Science Department" // Default fallback
  }

  // Mock data
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Department Head Dashboard</h1>
                <p className="text-sm text-gray-600">{getDepartmentName()}</p>
                {welcomeMessage && (
                  <p className="text-sm text-blue-600 mt-1">{welcomeMessage}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{getUserInitials(userInfo?.name || '')}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{userInfo?.name || 'Loading...'}</p>
                <p className="text-gray-500">{getDepartmentName()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.totalTeachers}</p>
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
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentStats.activeCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/department/overview">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-6 w-6 text-blue-600 mr-3" />
                    Overview
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </CardTitle>
                <CardDescription>Department overview and recent activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recent Activities</span>
                    <span className="font-medium text-blue-600">12 new</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quick Actions</span>
                    <span className="font-medium text-emerald-600">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/department/approvals">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                    Document Approval
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </CardTitle>
                <CardDescription>Review, approve and reject document submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending Approvals</span>
                    <span className="font-medium text-yellow-600">{departmentStats.pendingApprovals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-medium text-green-600">+{departmentStats.approvedThisMonth}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/department/teachers">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-purple-600 mr-3" />
                    Teachers
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </CardTitle>
                <CardDescription>Manage department faculty and their documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Faculty</span>
                    <span className="font-medium text-blue-600">{departmentStats.totalTeachers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Teachers</span>
                    <span className="font-medium text-green-600">22</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/department/analytics">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="h-6 w-6 text-orange-600 mr-3" />
                    Department Analytics
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </CardTitle>
                <CardDescription>Visual analysis and department statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Approval Rate</span>
                    <span className="font-medium text-green-600">92.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Performance</span>
                    <span className="font-medium text-blue-600">Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/department/courses">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-6 w-6 text-indigo-600 mr-3" />
                    Course Management
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </CardTitle>
                <CardDescription>Manage courses and academic programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Courses</span>
                    <span className="font-medium text-blue-600">{departmentStats.activeCourses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Students</span>
                    <span className="font-medium text-emerald-600">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/department/reports">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-pink-600 mr-3" />
                    Reports & Insights
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                </CardTitle>
                <CardDescription>Generate detailed department reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Reports</span>
                    <span className="font-medium text-blue-600">Available</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Export Options</span>
                    <span className="font-medium text-emerald-600">PDF, Excel</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 text-blue-600 mr-2" />
              Recent Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{departmentStats.approvedThisMonth}</p>
                <p className="text-sm text-gray-600">Documents Approved This Month</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{departmentStats.pendingApprovals}</p>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">22</p>
                <p className="text-sm text-gray-600">Active Faculty Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
