"use client"

"use client"

"use client"

"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Clock,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Video,
  FileQuestion,
  Users,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  User,
  ArrowRight,
  Award,
  BarChart3,
  MessageSquare,
  Star,
  CheckCircle,
  Activity,
  Zap,
  Settings,
  HelpCircle,
  Bookmark,
  History,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAuthToken, apiClient } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string | { name: string }
  student_id?: string
  department_id?: number
  created_at?: string
  updated_at?: string
}

interface Activity {
  id: number
  title: string
  type: string
  date: string
  document_id?: number
  search_term?: string
}

interface Document {
  id: number
  title: string
  description: string
  type: string
  department: string
  uploaded_by: string
  uploaded_at: string
  downloads: number
  views: number
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [stats, setStats] = useState({
    documentsAccessed: 0,
    searchesThisWeek: 0,
    downloads: 0,
    semesterDocuments: 0,
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [recentlyViewedDocuments, setRecentlyViewedDocuments] = useState<Document[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load dashboard data from API
        const response = await apiClient.getStudentDashboard()
        
        if (response.success && response.data) {
          const { user: userData, stats: statsData, recentActivity, recentlyViewedDocuments } = response.data
          
          setUser(userData)
          setStats(statsData)
          setRecentActivity(recentActivity || [])
          setRecentlyViewedDocuments(recentlyViewedDocuments || [])
          
          // Set welcome message with time-based greeting
          const hour = new Date().getHours()
          let greeting = ""
          if (hour < 12) greeting = "Good morning"
          else if (hour < 18) greeting = "Good afternoon"
          else greeting = "Good evening"
          
          const firstName = userData.name ? userData.name.split(' ')[0] : 'Student'
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

    loadDashboardData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />
      case 'download':
        return <Download className="h-4 w-4 text-green-500" />
      case 'search_result':
        return <Search className="h-4 w-4 text-purple-500" />
      case 'preview':
        return <Eye className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-blue-100 font-medium">Welcome back!</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  {welcomeMessage}
                </h1>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Ready to explore the vast collection of academic resources? Your personalized dashboard is here to help you succeed.
                </p>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span className="text-blue-100">Active Student</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-300" />
                    <span className="text-blue-100">Premium Access</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stats.documentsAccessed}</div>
                    <div className="text-blue-100 text-sm">Documents Accessed</div>
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
              <CardTitle className="text-sm font-semibold text-blue-700">Documents Accessed</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.documentsAccessed}</div>
              <p className="text-xs text-gray-600 mt-1">Total documents accessed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-700">Searches This Week</CardTitle>
              <Search className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.searchesThisWeek}</div>
              <p className="text-xs text-gray-600 mt-1">Searches performed this week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-700">Downloads</CardTitle>
              <Download className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.downloads}</div>
              <p className="text-xs text-gray-600 mt-1">Total downloads</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-700">Semester Documents</CardTitle>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.semesterDocuments}</div>
              <p className="text-xs text-gray-600 mt-1">Documents added in last 6 months</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span>Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Link href="/student/browse">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors duration-200">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Browse Documents</h3>
                      <p className="text-xs text-gray-600">Find academic resources</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/exams">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-red-50 p-3 rounded-xl group-hover:bg-red-100 transition-colors duration-200">
                      <FileQuestion className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Exam Materials</h3>
                      <p className="text-xs text-gray-600">Past papers & solutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/videos">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors duration-200">
                      <Video className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Video Lectures</h3>
                      <p className="text-xs text-gray-600">Educational videos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/bookmarks">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-xl group-hover:bg-yellow-100 transition-colors duration-200">
                      <Bookmark className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">My Bookmarks</h3>
                      <p className="text-xs text-gray-600">Saved documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/history">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors duration-200">
                      <History className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Activity History</h3>
                      <p className="text-xs text-gray-600">Recent activities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/profile">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors duration-200">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">My Profile</h3>
                      <p className="text-xs text-gray-600">Manage your account</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest interactions with the archive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Viewed Documents */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-green-600" />
                <span>Recently Viewed</span>
              </CardTitle>
              <CardDescription>Documents you've recently accessed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyViewedDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{doc.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getDocumentTypeColor(doc.type)}>
                            {doc.type}
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
        </div>
      </div>
    </div>
  )
}


