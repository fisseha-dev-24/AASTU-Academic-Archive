"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  FileText,
  BookOpen,
  Download,
  BarChart3,
  PieChart,
  Building2,
  ChevronRight,
  GraduationCap,
  UserCheck,
  FileCheck,
  Target,
  TrendingUp,
  Activity,
  Calendar,
  MessageSquare,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { getAuthToken } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
}

export default function CollegeDeanDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  useEffect(() => {
    // Get user info from localStorage
    const token = getAuthToken()
    if (token) {
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
          const firstName = userData.name ? userData.name.split(' ')[0] : 'Dean'
          setWelcomeMessage(`${timeGreeting}, ${firstName}! Welcome back to your dashboard.`)
        } catch (error) {
          console.error('Error parsing user info:', error)
        }
      }
    }
    setLoading(false)
  }, [])

  // Mock data for college-level overview
  const collegeStats = {
    totalDepartments: 5,
    totalTeachers: 124,
    totalStudents: 2847,
    totalDocuments: 8456,
    pendingApprovals: 47,
    approvedThisMonth: 892,
    rejectedThisMonth: 23,
    activeCourses: 186,
  }

  // Hierarchical department structure
  const departments = [
    {
      id: "cs",
      name: "Computer Science",
      code: "CS",
      head: "Dr. Sarah Johnson",
      teachers: 24,
      students: 645,
      documents: 1247,
      pendingApprovals: 18,
      courses: 45,
      performance: 94.2,
    },
    {
      id: "ee",
      name: "Electrical Engineering",
      code: "EE",
      head: "Prof. Michael Chen",
      teachers: 28,
      students: 578,
      documents: 1456,
      pendingApprovals: 12,
      courses: 38,
      performance: 91.8,
    },
    {
      id: "me",
      name: "Mechanical Engineering",
      code: "ME",
      head: "Dr. Emily Davis",
      teachers: 32,
      students: 692,
      documents: 1789,
      pendingApprovals: 8,
      courses: 42,
      performance: 96.1,
    },
    {
      id: "ce",
      name: "Civil Engineering",
      code: "CE",
      head: "Prof. Ahmed Hassan",
      teachers: 26,
      students: 534,
      documents: 1234,
      pendingApprovals: 6,
      courses: 36,
      performance: 89.7,
    },
    {
      id: "ie",
      name: "Industrial Engineering",
      code: "IE",
      head: "Dr. Lisa Wang",
      teachers: 14,
      students: 398,
      documents: 2730,
      pendingApprovals: 3,
      courses: 25,
      performance: 92.4,
    },
  ]

  // Document tree structure by department and year
  const documentTree = [
    {
      department: "Computer Science",
      years: [
        {
          year: 2024,
          documents: [
            {
              id: 1,
              title: "Advanced Database Systems - Course Materials",
              teacher: "Dr. Sarah Johnson",
              type: "Course Material",
              approvedDate: "2024-01-15",
              downloads: 245,
            },
            {
              id: 2,
              title: "Machine Learning Research Paper",
              teacher: "Prof. Michael Chen",
              type: "Research Paper",
              approvedDate: "2024-01-14",
              downloads: 189,
            },
          ],
        },
        {
          year: 2023,
          documents: [
            {
              id: 3,
              title: "Software Engineering Lab Manual",
              teacher: "Dr. Emily Davis",
              type: "Lab Manual",
              approvedDate: "2023-12-20",
              downloads: 567,
            },
          ],
        },
      ],
    },
  ]

  const toggleDepartment = (deptId: string) => {
    setExpandedDepartments((prev) => (prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]))
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 95) return "text-green-600"
    if (performance >= 90) return "text-blue-600"
    if (performance >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 95) return "bg-green-100 text-green-800"
    if (performance >= 90) return "bg-blue-100 text-blue-800"
    if (performance >= 85) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Department of Computer Science has 5 pending document approvals",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      message: "Monthly performance report is ready for review",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      type: "success",
      message: "All departments have submitted their quarterly reports",
      timestamp: "2 days ago",
    },
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
  const firstName = user?.name ? user.name.split(' ')[0] : 'Dean'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">College Dean Dashboard</h1>
                <p className="text-sm text-gray-600">College of Engineering & Technology</p>
                {welcomeMessage && (
                  <p className="text-sm text-blue-600 mt-1">{welcomeMessage}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export College Report
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CD'}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name || 'Loading...'}</p>
                <p className="text-gray-500">College Dean</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{welcomeMessage || `Welcome back, ${user?.name ? user.name.split(' ')[0] : 'Dean'}!`}</h2>
          <p className="text-gray-600">Manage your college operations and monitor department performance.</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{collegeStats.totalDepartments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                  <p className="text-2xl font-bold text-gray-900">{collegeStats.totalTeachers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{collegeStats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{collegeStats.totalDocuments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/dean/overview">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">College Overview</h3>
                      <p className="text-sm text-gray-600">Department performance & analytics</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {collegeStats.totalDepartments} Departments
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    94.8% Avg Performance
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dean/documents">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Documents Tree</h3>
                      <p className="text-sm text-gray-600">College → Department → Year structure</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-1" />
                    {collegeStats.totalDocuments} Documents
                  </span>
                  <span className="flex items-center">
                    <Activity className="h-4 w-4 mr-1" />
                    {collegeStats.approvedThisMonth} This Month
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dean/faculty">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Faculty Tree</h3>
                      <p className="text-sm text-gray-600">Department-wise faculty with statistics</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-1" />
                    {collegeStats.totalTeachers} Faculty
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {collegeStats.activeCourses} Active Courses
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 text-blue-600 mr-2" />
                Recent College Activity
              </CardTitle>
              <CardDescription>Latest updates across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">18 documents approved in Computer Science</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New faculty member added to Mechanical Engineering
                    </p>
                    <p className="text-xs text-gray-600">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Department performance review completed</p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 text-emerald-600 mr-2" />
                College Performance Summary
              </CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Most Active Department</span>
                  <span className="text-sm text-gray-600">Mechanical Engineering</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Highest Performance</span>
                  <span className="text-sm text-gray-600">Mechanical Engineering (96.1%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Pending Approvals</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{collegeStats.pendingApprovals}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">College Approval Rate</span>
                  <Badge className="bg-green-100 text-green-800">94.8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Documents This Month</span>
                  <span className="text-sm text-green-600">+{collegeStats.approvedThisMonth}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
