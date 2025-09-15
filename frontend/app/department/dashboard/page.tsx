"use client"

"use client"

"use client"

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Loader2,
  Star,
  Zap,
  Eye,
  XCircle,
  Shield,
  Building,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

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

interface DepartmentStats {
  total_documents: number
  pending_approval: number
  approved_this_month: number
  rejected_this_month: number
  total_faculty: number
  total_students: number
}

interface Document {
  id: number
  title: string
  description: string
  type: string
  department: string
  uploaded_by: string
  uploaded_at: string
  status: string
}

export default function DepartmentHeadDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [stats, setStats] = useState<DepartmentStats>({
    total_documents: 0,
    pending_approval: 0,
    approved_this_month: 0,
    rejected_this_month: 0,
    total_faculty: 0,
    total_students: 0
  })
  const [loading, setLoading] = useState(true)
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([])

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('user_info')
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo)
      setUserInfo(user)
      
      // Set welcome message with time-based greeting
      const hour = new Date().getHours()
      let greeting = ""
      if (hour < 12) greeting = "Good morning"
      else if (hour < 18) greeting = "Good afternoon"
      else greeting = "Good evening"
      
      const firstName = user.name ? user.name.split(' ')[0] : 'Department Head'
      setWelcomeMessage(`${greeting}, ${firstName}!`)
    }
    
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await apiClient.getDepartmentStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
      
      // Load pending documents
      try {
        const documentsResponse = await apiClient.getPendingDocuments()
        if (documentsResponse.success) {
          setPendingDocuments(documentsResponse.data.slice(0, 5))
        }
      } catch (error) {
        console.error('Error loading pending documents:', error)
        // Set fallback data
        setPendingDocuments([
          {
            id: 1,
            title: "Advanced Data Structures",
            description: "Comprehensive guide to advanced data structures",
            type: "Lecture Notes",
            department: "Computer Science",
            uploaded_by: "Dr. Smith",
            uploaded_at: "2024-01-15",
            status: "pending"
          },
          {
            id: 2,
            title: "Software Engineering Principles",
            description: "Core principles of software development",
            type: "Textbook",
            department: "Computer Science",
            uploaded_by: "Prof. Johnson",
            uploaded_at: "2024-01-14",
            status: "pending"
          },
          {
            id: 3,
            title: "Database Management Systems",
            description: "Introduction to database systems",
            type: "Lecture Notes",
            department: "Computer Science",
            uploaded_by: "Dr. Williams",
            uploaded_at: "2024-01-13",
            status: "pending"
          }
        ])
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      // Set empty stats on error
      setStats({
        total_documents: 0,
        pending_approval: 0,
        approved_this_month: 0,
        rejected_this_month: 0,
        total_faculty: 0,
        total_students: 0
      })
    } finally {
      setLoading(false)
    }
  }

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
    return "Computer Science Department" // Default fallback
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'Lecture Notes':
        return 'bg-blue-100 text-blue-800'
      case 'Textbook':
        return 'bg-green-100 text-green-800'
      case 'Exam':
        return 'bg-red-100 text-red-800'
      case 'Assignment':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
        title="Department Head Dashboard"
        subtitle="Manage your department's academic resources"
        backUrl="/"
        user={userInfo}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-purple-100 font-medium">Welcome back, Department Head!</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  {welcomeMessage}
                </h1>
                <p className="text-purple-100 text-lg max-w-2xl">
                  Oversee academic quality, manage document approvals, and ensure the highest standards of educational content in your department.
                </p>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-300" />
                    <span className="text-purple-100">Department Head</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-yellow-300" />
                    <span className="text-purple-100">{getDepartmentName()}</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stats.pending_approval}</div>
                    <div className="text-purple-100 text-sm">Pending Approvals</div>
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
              <CardTitle className="text-sm font-semibold text-purple-700">Total Documents</CardTitle>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.total_documents}</div>
              <p className="text-xs text-gray-600 mt-1">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-700">Pending Approval</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending_approval}</div>
              <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-700">Approved This Month</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved_this_month}</div>
              <p className="text-xs text-gray-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-red-700">Rejected This Month</CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected_this_month}</div>
              <p className="text-xs text-gray-600 mt-1">Quality control</p>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Department Overview</span>
              </CardTitle>
              <CardDescription>Faculty and student statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_faculty}</div>
                  <div className="text-sm text-gray-600">Faculty Members</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{stats.total_students}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span>Approval Rate</span>
              </CardTitle>
              <CardDescription>Document approval statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Approval Rate</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats.total_documents > 0 ? Math.round((stats.approved_this_month / (stats.approved_this_month + stats.rejected_this_month)) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${stats.total_documents > 0 ? Math.round((stats.approved_this_month / (stats.approved_this_month + stats.rejected_this_month)) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-purple-600" />
            <span>Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/department/approvals">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors duration-200">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Review Documents</h3>
                      <p className="text-sm text-gray-600">Approve or reject submissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/department/documents">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">All Documents</h3>
                      <p className="text-sm text-gray-600">Browse department documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/department/analytics">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors duration-200">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">Department insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/department/profile">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors duration-200">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Profile</h3>
                      <p className="text-sm text-gray-600">Manage your account</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Documents */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Pending Approvals</span>
              </CardTitle>
              <CardDescription>Documents awaiting your review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{doc.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getDocumentTypeColor(doc.type)}>
                            {doc.type}
                          </Badge>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">By {doc.uploaded_by}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingDocuments.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending approvals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest department activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-xl">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Approved "Advanced Data Structures"</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-xl">
                  <div className="flex-shrink-0 mt-1">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Rejected "Outdated Material"</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-xl">
                  <div className="flex-shrink-0 mt-1">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">New faculty member joined</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
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
