"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Users, Mail, Award, FileText, Search, Download, ArrowLeft, Phone, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

export default function DepartmentTeachers() {
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

  const teachers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@aastu.edu.et",
      phone: "+251-911-123-456",
      specialization: "Database Systems",
      documentsUploaded: 45,
      lastActive: "2024-01-15",
      status: "active",
      joinDate: "2019-09-01",
      courses: ["Advanced Database Systems", "Data Mining"],
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@aastu.edu.et",
      phone: "+251-911-234-567",
      specialization: "Machine Learning",
      documentsUploaded: 67,
      lastActive: "2024-01-14",
      status: "active",
      joinDate: "2018-02-15",
      courses: ["Machine Learning", "Artificial Intelligence", "Deep Learning"],
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      email: "emily.davis@aastu.edu.et",
      phone: "+251-911-345-678",
      specialization: "Software Engineering",
      documentsUploaded: 32,
      lastActive: "2024-01-12",
      status: "inactive",
      joinDate: "2020-08-10",
      courses: ["Software Engineering", "Web Development"],
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      email: "james.wilson@aastu.edu.et",
      phone: "+251-911-456-789",
      specialization: "Data Structures",
      documentsUploaded: 28,
      lastActive: "2024-01-13",
      status: "active",
      joinDate: "2021-01-20",
      courses: ["Data Structures", "Algorithms"],
    },
    {
      id: 5,
      name: "Prof. Lisa Anderson",
      email: "lisa.anderson@aastu.edu.et",
      phone: "+251-911-567-890",
      specialization: "Computer Networks",
      documentsUploaded: 53,
      lastActive: "2024-01-11",
      status: "active",
      joinDate: "2017-05-30",
      courses: ["Computer Networks", "Network Security", "Distributed Systems"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Faculty Management"
        subtitle="Manage department teachers"
        backUrl="/department/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Faculty Members</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Teachers List */}
        <div className="grid gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/generic-placeholder-icon.png?height=64&width=64`} />
                      <AvatarFallback className="text-lg">
                        {teacher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
                        <Badge
                          className={
                            teacher.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {teacher.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 " />
                            {teacher.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 " />
                            {teacher.phone}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 " />
                            {teacher.specialization}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 " />
                            Joined: {teacher.joinDate}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 " />
                            {teacher.documentsUploaded} documents uploaded
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 " />
                            {teacher.courses.length} courses
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Teaching Courses:</p>
                        <div className="flex flex-wrap gap-2">
                          {teacher.courses.map((course, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-blue-600">{teacher.documentsUploaded}</p>
                      <p className="text-xs text-gray-600">Documents</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Last active: {teacher.lastActive}</p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Documents
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Faculty Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-600">Total Faculty</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">22</p>
              <p className="text-sm text-gray-600">Active Teachers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">1,247</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">45</p>
              <p className="text-sm text-gray-600">Active Courses</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
