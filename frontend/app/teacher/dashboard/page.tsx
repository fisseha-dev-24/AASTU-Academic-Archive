"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Star,
  CheckCircle,
  Activity,
  Zap,
  Eye,
  Download,
  Search,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string | { name: string }
  student_id?: string
  department_id?: number
}

interface DashboardStats {
  totalDocuments: number
  totalVideos: number
  pendingApproval: number
  pendingVideoApproval: number
  approvedDocuments: number
  approvedVideos: number
  rejectedDocuments: number
  rejectedVideos: number
  monthlyUploads: number
  monthlyVideoUploads: number
}

interface Document {
  id: number
  title: string
  document_type: string
  status: string
  created_at: string
  views: number
  downloads: number
  department: string
}

interface Video {
  id: number
  title: string
  video_platform: string
  status: string
  created_at: string
  views: number
  department: string
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([])
  const [recentVideos, setRecentVideos] = useState<Video[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Get teacher dashboard data from API
      const response = await apiClient.getTeacherDashboard()
      
      if (response.success && response.data) {
        const { user: userData, stats: statsData, recentDocuments, recentVideos } = response.data
        
        setUser(userData)
        setStats(statsData)
        setRecentDocuments(recentDocuments || [])
        setRecentVideos(recentVideos || [])
        
        // Set welcome message with time-based greeting
        const hour = new Date().getHours()
        let greeting = ""
        if (hour < 12) greeting = "Good morning"
        else if (hour < 18) greeting = "Good afternoon"
        else greeting = "Good evening"
        
        const firstName = userData.name ? userData.name.split(' ')[0] : 'Teacher'
        setWelcomeMessage(`${greeting}, ${firstName}!`)
      } else {
        // Handle API error
        console.error('Failed to load dashboard data:', response.message)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDepartmentName = () => {
    if (user?.department) {
      // Handle both string and object department values
      if (typeof user.department === 'string') {
        return user.department
      } else if (typeof user.department === 'object' && user.department.name) {
        return user.department.name
      }
    }
    return "Department" // Default fallback
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'lecture_notes':
        return 'bg-blue-100 text-blue-800'
      case 'textbook':
        return 'bg-green-100 text-green-800'
      case 'exam':
        return 'bg-red-100 text-red-800'
      case 'assignment':
        return 'bg-yellow-100 text-yellow-800'
      case 'lab_manual':
        return 'bg-purple-100 text-purple-800'
      case 'project':
        return 'bg-indigo-100 text-indigo-800'
      case 'thesis':
        return 'bg-pink-100 text-pink-800'
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

  const getVideoPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'bg-red-100 text-red-800'
      case 'vimeo':
        return 'bg-blue-100 text-blue-800'
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
        title="Teacher Dashboard"
        subtitle="Manage your academic resources"
        backUrl="/"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-emerald-100 font-medium">Welcome back, Professor!</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  {welcomeMessage}
                </h1>
                <p className="text-emerald-100 text-lg max-w-2xl">
                  Manage your academic resources, track student engagement, and contribute to the knowledge base. Your expertise shapes the future of education.
                </p>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span className="text-emerald-100">Verified Teacher</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-300" />
                    <span className="text-emerald-100">{getDepartmentName()}</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stats?.totalDocuments || 0}</div>
                    <div className="text-emerald-100 text-sm">Documents Uploaded</div>
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
              <CardTitle className="text-sm font-semibold text-emerald-700">Total Documents</CardTitle>
              <FileText className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats?.totalDocuments || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Documents uploaded</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-700">Total Videos</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.totalVideos || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Videos uploaded</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-700">Pending Approval</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{(stats?.pendingApproval || 0) + (stats?.pendingVideoApproval || 0)}</div>
              <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-700">Approved Content</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{(stats?.approvedDocuments || 0) + (stats?.approvedVideos || 0)}</div>
              <p className="text-xs text-gray-600 mt-1">Approved items</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-emerald-600" />
            <span>Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/teacher/upload">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors duration-200">
                      <Upload className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Upload Document</h3>
                      <p className="text-sm text-gray-600">Share new resources</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/teacher/upload-video">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-200 transition-colors duration-200">
                      <BookOpen className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Upload Video</h3>
                      <p className="text-sm text-gray-600">Share video content</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/teacher/my-documents">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">My Documents</h3>
                      <p className="text-sm text-gray-600">Manage your uploads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/teacher/analytics">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors duration-200">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">View engagement stats</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/teacher/profile">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors duration-200">
                      <Settings className="h-6 w-6 text-orange-600" />
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
          {/* Recent Documents */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span>Recent Documents</span>
              </CardTitle>
              <CardDescription>Your recently uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{doc.title}</h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getDocumentTypeColor(doc.document_type)}>
                            {doc.document_type}
                          </Badge>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{doc.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{doc.downloads}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Videos */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-red-600" />
                <span>Recent Videos</span>
              </CardTitle>
              <CardDescription>Your latest video uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVideos && recentVideos.length > 0 ? (
                  recentVideos.map((video) => (
                    <div key={video.id} className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex-shrink-0 mt-1">
                        <BookOpen className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                          <Badge className={`text-xs ${getStatusColor(video.status)}`}>
                            {video.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge className={`text-xs ${getVideoPlatformColor(video.video_platform)}`}>
                            {video.video_platform}
                          </Badge>
                          <span className="text-xs text-gray-500">{new Date(video.created_at).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Eye className="h-3 w-3" />
                            <span>{video.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No videos uploaded yet</p>
                    <p className="text-sm text-gray-400">Upload your first video to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
