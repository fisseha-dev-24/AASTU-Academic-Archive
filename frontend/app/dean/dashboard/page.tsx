"use client"

"use client"

"use client"

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  Building2,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Star,
  Zap,
  Shield,
  Award,
  Crown,
  Target,
  Globe,
  BookOpen,
  Settings,
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
  department?: string | { name: string }
}

interface DeanStats {
  total_departments: number
  total_teachers: number
  total_students: number
  total_documents: number
  pending_approvals: number
  approved_this_month: number
  rejected_this_month: number
  total_uploads_this_month: number
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

interface FacultyMember {
  id: number
  name: string
  email: string
  department: string
  total_uploads: number
  approved_uploads: number
  approval_rate: number
  last_activity: string
}

interface RecentActivity {
  id: number
  action: string
  user: string
  document: string | null
  timestamp: string
  details: string
}

export default function CollegeDeanDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DeanStats | null>(null)
  const [departmentAnalytics, setDepartmentAnalytics] = useState<DepartmentAnalytics[]>([])
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [welcomeMessage, setWelcomeMessage] = useState("")

  useEffect(() => {
    loadUserData()
    loadDashboardData()
  }, [])

  const loadUserData = () => {
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
        
        const firstName = userData.name ? userData.name.split(' ')[0] : 'Dean'
        setWelcomeMessage(`${greeting}, ${firstName}!`)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
  }

  const loadDashboardData = async () => {
    try {
      const response = await apiClient.getDeanDashboard()
      if (response.success && response.data) {
        setStats(response.data.stats)
        setDepartmentAnalytics(response.data.department_analytics)
      }
      
      // Load faculty performance data
      try {
        const facultyResponse = await apiClient.getFacultyMembers()
        if (facultyResponse.success && facultyResponse.data) {
          setFacultyMembers(facultyResponse.data)
        } else {
          setFacultyMembers([])
        }
      } catch (error) {
        console.error('Error loading faculty performance:', error)
        setFacultyMembers([])
      }
      
      // Load recent activities
      try {
        const activityResponse = await apiClient.getDeanRecentActivities()
        if (activityResponse.success && activityResponse.data) {
          setRecentActivities(activityResponse.data)
        } else {
          setRecentActivities([])
        }
      } catch (error) {
        console.error('Error loading recent activities:', error)
        setRecentActivities([])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set empty stats on error
      setStats({
        total_departments: 0,
        total_teachers: 0,
        total_students: 0,
        total_documents: 0,
        pending_approvals: 0,
        approved_this_month: 0,
        rejected_this_month: 0,
        total_uploads_this_month: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const getApprovalRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getApprovalRateBg = (rate: number) => {
    if (rate >= 90) return 'bg-green-100'
    if (rate >= 80) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'document approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'document rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'new faculty member':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'document uploaded':
        return <FileText className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PageHeader
        title="College Dean Dashboard"
        subtitle="Oversee academic excellence across all departments"
        backUrl="/"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <span className="text-indigo-100 font-medium">Welcome back, Dean!</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  {welcomeMessage}
                </h1>
                <p className="text-indigo-100 text-lg max-w-2xl">
                  Lead academic excellence, oversee department performance, and ensure the highest standards of education across the entire college.
                </p>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-300" />
                    <span className="text-indigo-100">College Dean</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-300" />
                    <span className="text-indigo-100">{stats?.total_departments || 0} Departments</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stats?.total_students?.toLocaleString() || 0}</div>
                    <div className="text-indigo-100 text-sm">Total Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-indigo-700">Total Departments</CardTitle>
              <Building2 className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats?.total_departments || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Active departments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-700">Total Faculty</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.total_teachers?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-600 mt-1">+5% from last year</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-700">Total Documents</CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.total_documents?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-700">Pending Approvals</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats?.pending_approvals || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-indigo-600" />
            <span>Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dean/documents">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors duration-200">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">All Documents</h3>
                      <p className="text-sm text-gray-600">Browse college documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dean/departments">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Departments</h3>
                      <p className="text-sm text-gray-600">Manage departments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dean/faculty">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Faculty</h3>
                      <p className="text-sm text-gray-600">Manage faculty members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dean/analytics">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors duration-200">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">College insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Analytics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Department Performance</span>
              </CardTitle>
              <CardDescription>Key metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(departmentAnalytics) && departmentAnalytics.map((dept) => (
                  <div key={dept.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                      <Badge className={`${getApprovalRateBg(dept.approval_rate)} ${getApprovalRateColor(dept.approval_rate)}`}>
                        {dept.approval_rate}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Faculty</div>
                        <div className="font-semibold text-blue-600">{dept.teacher_count}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Students</div>
                        <div className="font-semibold text-green-600">{dept.student_count}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Documents</div>
                        <div className="font-semibold text-purple-600">{dept.total_documents}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest college-wide activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(recentActivities) && recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user}</p>
                      {activity.document && (
                        <p className="text-xs text-gray-400">Document: {activity.document}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Performance */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                <span>Top Faculty Members</span>
              </CardTitle>
              <CardDescription>Faculty performance and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(facultyMembers) && facultyMembers.map((faculty) => (
                  <div key={faculty.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{faculty.name}</h4>
                        <p className="text-sm text-gray-500">{faculty.department}</p>
                      </div>
                      <Badge className={`${getApprovalRateBg(faculty.approval_rate)} ${getApprovalRateColor(faculty.approval_rate)}`}>
                        {faculty.approval_rate}%
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Uploads:</span>
                        <span className="font-semibold text-blue-600">{faculty.total_uploads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved:</span>
                        <span className="font-semibold text-green-600">{faculty.approved_uploads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="font-semibold text-purple-600">
                          {new Date(faculty.last_activity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
