"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FileText,
  Clock,
  TrendingUp,
  Award,
  Upload,
  Users,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  ArrowRight,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
}

interface DashboardStats {
  total_documents: number
  pending_approval: number
  total_views: number
  total_downloads: number
  recent_activity: any[]
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState("")

  useEffect(() => {
    // Load user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
        
        // Set welcome message
        const hour = new Date().getHours()
        let greeting = ""
        if (hour < 12) greeting = "Good morning"
        else if (hour < 18) greeting = "Good afternoon"
        else greeting = "Good evening"
        
        setWelcomeMessage(`${greeting}, ${userData.name}!`)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }

    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await apiClient.getTeacherStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDepartmentName = () => {
    if (user?.department) {
      return user.department
    }
    return "Computer Science Department" // Default fallback
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PageHeader
        title="Teacher Dashboard"
        subtitle={getDepartmentName()}
        backUrl="/"
        user={user}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {welcomeMessage && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">{welcomeMessage}</h2>
              <p className="text-blue-700">Welcome back to your teaching dashboard. Here's what's happening today.</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.total_documents || 0}</div>
              <p className="text-xs text-gray-600">Across all courses</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pending_approval || 0}</div>
              <p className="text-xs text-gray-600">Awaiting department approval</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Monthly Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{(stats?.total_views || 0).toLocaleString()}</div>
              <p className="text-xs text-gray-600">Document views this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Downloads</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{(stats?.total_downloads || 0).toLocaleString()}</div>
              <p className="text-xs text-gray-600">Document downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/teacher/upload">
            <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-blue-200 hover:border-blue-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">Upload Documents</CardTitle>
                <CardDescription>Upload new course materials and resources</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/my-documents">
            <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-emerald-200 hover:border-emerald-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-600">My Documents</CardTitle>
                <CardDescription>View and manage your uploaded documents</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/pending-approval">
            <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-yellow-200 hover:border-yellow-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-600">Pending Approval</CardTitle>
                <CardDescription>Check status of submitted documents</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/analytics">
            <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-purple-200 hover:border-purple-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">Analytics</CardTitle>
                <CardDescription>View document performance and insights</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/student-feedback">
            <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-indigo-200 hover:border-indigo-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-indigo-600">Student Feedback</CardTitle>
                <CardDescription>Review student comments and ratings</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/schedule">
            <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-orange-200 hover:border-orange-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-orange-600">Schedule</CardTitle>
                <CardDescription>Manage your academic schedule</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                  stats.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/teacher/upload">
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Document
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/teacher/my-documents">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View My Documents
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/teacher/analytics">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/teacher/schedule">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedule
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
