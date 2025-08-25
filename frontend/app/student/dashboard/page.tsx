"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAuthToken } from "@/lib/api"

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

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState("")

  useEffect(() => {
    // Get user info from localStorage or API
    const token = getAuthToken()
    if (token) {
      // Try to get user info from localStorage first
      const userInfo = localStorage.getItem('user_info')
      if (userInfo) {
        try {
          const userData = JSON.parse(userInfo)
          setUser(userData)
          
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
          const firstName = userData.name ? userData.name.split(' ')[0] : 'Student'
          setWelcomeMessage(`${timeGreeting}, ${firstName}! Welcome back to your dashboard.`)
        } catch (error) {
          console.error('Error parsing user info:', error)
        }
      }
    }
    setLoading(false)
  }, [])

  // Mock data - in real app this would come from API
  const recentActivity = [
    {
      id: 1,
      title: "Downloaded Software Engineering Project Report",
      type: "Download",
      date: "2 hours ago",
    },
    { id: 2, title: "Searched for Database Systems materials", type: "Search", date: "1 day ago" },
    { id: 3, title: "Viewed Computer Networks Lab Report", type: "View", date: "2 days ago" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Get user's first name for welcome message
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student'
  const studentId = user?.student_id || 'AASTU/2021/001' // Fallback if not available

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">AASTU Archive System</p>
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
                <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name || 'Student'}</p>
                <p className="text-gray-500">Student ID: {studentId}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{welcomeMessage || `Welcome back, ${firstName}!`}</h2>
          <p className="text-gray-600">Explore the AASTU archive system and access academic resources.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Documents Accessed</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Searches This Week</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Semester</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Explore Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/student/browse">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Search className="h-10 w-10 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Browse Documents</h3>
                      <p className="text-sm text-gray-600">Advanced search & filtering</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Search by tags, department, year, author, and more</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/suggestions">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-emerald-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-10 w-10 text-emerald-600" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Suggestions</h3>
                      <p className="text-sm text-gray-600">Personalized recommendations</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">AI-powered document suggestions based on your interests</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/exams">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-purple-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <FileQuestion className="h-10 w-10 text-purple-600" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Exam Materials</h3>
                      <p className="text-sm text-gray-600">Past papers & solutions</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Access previous exam papers and model solutions</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/videos">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-red-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Video className="h-10 w-10 text-red-600" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Video Library</h3>
                      <p className="text-sm text-gray-600">Educational content</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Lecture recordings and educational videos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/study-groups">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-orange-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-10 w-10 text-orange-600" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Study Groups</h3>
                      <p className="text-sm text-gray-600">Collaborative learning</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Join study groups and share resources with peers</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/calendar">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-indigo-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-10 w-10 text-indigo-600" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Academic Calendar</h3>
                      <p className="text-sm text-gray-600">Important dates</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Track deadlines, exams, and academic events</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest interactions with the archive system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "Download" && <Download className="h-5 w-5 text-green-600" />}
                      {activity.type === "Search" && <Search className="h-5 w-5 text-blue-600" />}
                      {activity.type === "View" && <FileText className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                Quick Access
              </CardTitle>
              <CardDescription>Frequently used features and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/student/browse?filter=recent">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Recently Added Documents
                  </Button>
                </Link>
                <Link href="/student/browse?department=software">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Software Engineering Materials
                  </Button>
                </Link>
                <Link href="/student/profile">
                  <Button variant="ghost" className="w-full justify-start">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    My Profile & Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
