"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Building2,
  GraduationCap,
  Target,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function CollegeOverview() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

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

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 95) return "bg-green-100 text-green-800"
    if (performance >= 90) return "bg-blue-100 text-blue-800"
    if (performance >= 85) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dean/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">College Overview</h1>
                <p className="text-sm text-gray-600">Department Performance & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* College Statistics Cards */}
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

        {/* Department Performance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Department Performance Overview
            </CardTitle>
            <CardDescription>Real-time performance metrics across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600">Head: {dept.head}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{dept.teachers}</p>
                      <p className="text-gray-600">Faculty</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{dept.students}</p>
                      <p className="text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{dept.documents}</p>
                      <p className="text-gray-600">Documents</p>
                    </div>
                    <div className="text-center">
                      <Badge className={getPerformanceBadge(dept.performance)}>{dept.performance}% Performance</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* College Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">College-wide trend visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 text-emerald-600 mr-2" />
                Department Distribution
              </CardTitle>
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
                  <span className="text-sm text-yellow-600">{collegeStats.pendingApprovals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">College Approval Rate</span>
                  <span className="text-sm text-green-600">94.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
