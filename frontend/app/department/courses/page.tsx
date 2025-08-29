"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, FileText, Search, Download, ArrowLeft, Calendar, Clock, Award } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<{
    id: number
    name: string
    email: string
    role: string
    department?: string
    student_id?: string
    department_id?: number
  } | null>(null)

  // Load user data
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
  }, [])

  const courses = [
    {
      id: 1,
      code: "CS 401",
      title: "Advanced Database Systems",
      instructor: "Dr. Sarah Johnson",
      enrolledStudents: 45,
      materials: 12,
      status: "active",
      semester: "Spring 2024",
      credits: 3,
      schedule: "Mon, Wed, Fri 10:00-11:00",
    },
    {
      id: 2,
      code: "CS 402",
      title: "Machine Learning",
      instructor: "Prof. Michael Chen",
      enrolledStudents: 38,
      materials: 18,
      status: "active",
      semester: "Spring 2024",
      credits: 4,
      schedule: "Tue, Thu 14:00-16:00",
    },
    {
      id: 3,
      code: "CS 403",
      title: "Software Engineering",
      instructor: "Dr. Emily Davis",
      enrolledStudents: 52,
      materials: 8,
      status: "pending_review",
      semester: "Spring 2024",
      credits: 3,
      schedule: "Mon, Wed 16:00-17:30",
    },
    {
      id: 4,
      code: "CS 301",
      title: "Data Structures and Algorithms",
      instructor: "Dr. James Wilson",
      enrolledStudents: 67,
      materials: 15,
      status: "active",
      semester: "Spring 2024",
      credits: 4,
      schedule: "Tue, Thu 10:00-12:00",
    },
    {
      id: 5,
      code: "CS 404",
      title: "Computer Networks",
      instructor: "Prof. Lisa Anderson",
      enrolledStudents: 41,
      materials: 22,
      status: "active",
      semester: "Spring 2024",
      credits: 3,
      schedule: "Wed, Fri 14:00-15:30",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending_review":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Course Management"
        subtitle="Manage department courses"
        backUrl="/department/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Department Courses</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Award className="h-4 w-4 mr-1" />
                      {course.code} - {course.instructor}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(course.status)}>{course.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Enrolled Students
                    </span>
                    <span className="font-medium">{course.enrolledStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Course Materials
                    </span>
                    <span className="font-medium">{course.materials} documents</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Credits
                    </span>
                    <span className="font-medium">{course.credits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Semester
                    </span>
                    <span className="font-medium">{course.semester}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.schedule}
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">45</p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">1,247</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">875</p>
              <p className="text-sm text-gray-600">Course Materials</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">3.2</p>
              <p className="text-sm text-gray-600">Avg. Credits</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
