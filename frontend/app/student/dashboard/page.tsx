"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
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
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAuthToken, apiClient } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
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
      // Get user info from localStorage or API
      const token = getAuthToken()
      if (token) {
        // Try to get user info from localStorage first
        const userInfo = localStorage.getItem('user_info')
        if (userInfo) {
          try {
            const userData = JSON.parse(userInfo)
            setUser(userData)
            
            // Set welcome message with time-based greeting
            const hour = new Date().getHours()
            let greeting = ""
            if (hour < 12) greeting = "Good morning"
            else if (hour < 18) greeting = "Good afternoon"
            else greeting = "Good evening"
            
            const firstName = userData.name ? userData.name.split(' ')[0] : 'Student'
            setWelcomeMessage(`${greeting}, ${firstName}!`)

            // Load dashboard data from API
            try {
              // Get student stats
              const statsResponse = await apiClient.getStudentStats()
              if (statsResponse.success && statsResponse.data) {
                setStats({
                  documentsAccessed: statsResponse.data.documents_accessed,
                  searchesThisWeek: statsResponse.data.searches_this_week,
                  downloads: statsResponse.data.downloads,
                  semesterDocuments: statsResponse.data.semester_documents,
                })
              }

              // Get recent activity
              const activityResponse = await apiClient.getStudentRecentActivity()
              if (activityResponse.success && activityResponse.data && Array.isArray(activityResponse.data)) {
                setRecentActivity(activityResponse.data)
              }

              // Get recently viewed documents (instead of recently added)
              const documentsResponse = await apiClient.getRecentlyViewedDocuments()
              if (documentsResponse.success && documentsResponse.data && Array.isArray(documentsResponse.data)) {
                setRecentlyViewedDocuments(documentsResponse.data)
              }
            } catch (error) {
              console.error('Error loading dashboard data:', error)
            }
          } catch (error) {
            console.error('Error parsing user info:', error)
          }
        }
      }
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Get user's first name for welcome message
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student'
  const studentId = user?.student_id || 'AASTU/2021/001' // Fallback if not available

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <PageHeader
        title="Student Dashboard"
        subtitle="AASTU Digital Repository"
        user={user}
        showBackButton={false}
      >
        {welcomeMessage && (
          <p className="text-sm text-amber-700">{welcomeMessage}</p>
        )}
      </PageHeader>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {welcomeMessage && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-700 to-blue-800 bg-clip-text text-transparent mb-2">{welcomeMessage}</h2>
              <p className="text-gray-700">Welcome back to your student dashboard. Here's what's happening with your academic resources.</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Documents Accessed</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.documentsAccessed}</div>
              <p className="text-xs text-gray-600">Total documents viewed</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-amber-100 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Searches This Week</CardTitle>
              <Search className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{stats.searchesThisWeek}</div>
              <p className="text-xs text-gray-600">Research queries made</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Downloads</CardTitle>
              <Download className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-700">{stats.downloads}</div>
              <p className="text-xs text-gray-600">Documents downloaded</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">This Semester</CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.semesterDocuments}</div>
              <p className="text-xs text-gray-600">Semester materials</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/student/browse">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-400 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Browse Documents</CardTitle>
                <CardDescription>Advanced search & filtering</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/student/suggestions">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-amber-200 hover:border-amber-400 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mb-4 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                  <Lightbulb className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-amber-700">Suggestions</CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/student/exams">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-400 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <FileQuestion className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Exam Materials</CardTitle>
                <CardDescription>Past papers & solutions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/student/videos">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-slate-400 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                  <Video className="h-8 w-8 text-slate-600" />
                </div>
                <CardTitle className="text-slate-700">Video Library</CardTitle>
                <CardDescription>Educational content</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/student/study-groups">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-amber-200 hover:border-amber-400 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mb-4 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-amber-700">Study Groups</CardTitle>
                <CardDescription>Collaborative learning</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/student/calendar">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-400 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Academic Calendar</CardTitle>
                <CardDescription>Important dates</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity && recentActivity.length > 0 ? recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl border border-blue-100">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {typeof activity.title === 'string' ? activity.title : 'Unknown Activity'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {typeof activity.date === 'string' ? activity.date : 'Unknown Date'}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-amber-100 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Users className="h-5 w-5 mr-2 text-amber-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/student/browse?filter=recent">
                  <Button className="w-full justify-start border-blue-200 text-blue-800 hover:bg-blue-50 hover:border-blue-300 rounded-xl" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Recently Viewed
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href={`/student/browse?department=${user?.department_id || 'all'}`}>
                  <Button className="w-full justify-start border-amber-200 text-amber-800 hover:bg-amber-50 hover:border-amber-300 rounded-xl" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Department Materials
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/student/suggestions">
                  <Button className="w-full justify-start border-amber-200 text-amber-800 hover:bg-amber-50 hover:border-amber-300 rounded-xl" variant="outline">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Recommended
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/student/exams">
                  <Button className="w-full justify-start border-blue-200 text-blue-800 hover:bg-blue-50 hover:border-blue-300 rounded-xl" variant="outline">
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Exam Materials
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recently Viewed Documents */}
        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Eye className="h-5 w-5 mr-2 text-slate-600" />
                Recently Viewed Documents
              </CardTitle>
              <CardDescription>Documents you've recently accessed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyViewedDocuments && recentlyViewedDocuments.length > 0 ? recentlyViewedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {typeof doc.title === 'string' ? doc.title : 'Unknown Document'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {typeof doc.type === 'string' ? doc.type : 'Unknown Type'} • {typeof doc.department === 'string' ? doc.department : 'Unknown Department'}
                      </p>
                      <p className="text-xs text-gray-400">Viewed {typeof doc.views === 'number' ? doc.views : 0} times</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recently viewed documents</p>
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


