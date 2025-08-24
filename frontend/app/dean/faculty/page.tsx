"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Users,
  FileText,
  BookOpen,
  Search,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  UserCheck,
  ArrowLeft,
  Download,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function FacultyTree() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null)

  // Faculty tree structure by department
  const facultyTree = [
    {
      id: "cs",
      name: "Computer Science",
      code: "CS",
      head: "Dr. Sarah Johnson",
      teachers: 24,
      students: 645,
      documents: 1247,
      courses: 45,
      performance: 94.2,
      faculty: [
        {
          id: "sarah-johnson",
          name: "Dr. Sarah Johnson",
          position: "Department Head & Professor",
          email: "sarah.johnson@aastu.edu.et",
          phone: "+251-11-123-4567",
          specialization: "Database Systems, Data Mining",
          experience: "15 years",
          courses: ["Advanced Database Systems", "Data Mining", "Database Design"],
          documents: 45,
          students: 120,
          rating: 4.8,
          publications: 23,
          joinDate: "2009-08-15",
        },
        {
          id: "michael-chen",
          name: "Prof. Michael Chen",
          position: "Associate Professor",
          email: "michael.chen@aastu.edu.et",
          phone: "+251-11-123-4568",
          specialization: "Machine Learning, AI",
          experience: "12 years",
          courses: ["Machine Learning", "Artificial Intelligence", "Pattern Recognition"],
          documents: 38,
          students: 95,
          rating: 4.7,
          publications: 31,
          joinDate: "2012-01-20",
        },
        {
          id: "emily-davis",
          name: "Dr. Emily Davis",
          position: "Assistant Professor",
          email: "emily.davis@aastu.edu.et",
          phone: "+251-11-123-4569",
          specialization: "Software Engineering, Web Development",
          experience: "8 years",
          courses: ["Software Engineering", "Web Development", "Mobile App Development"],
          documents: 28,
          students: 85,
          rating: 4.6,
          publications: 15,
          joinDate: "2016-09-01",
        },
      ],
    },
    {
      id: "ee",
      name: "Electrical Engineering",
      code: "EE",
      head: "Prof. Ahmed Hassan",
      teachers: 28,
      students: 578,
      documents: 1456,
      courses: 38,
      performance: 91.8,
      faculty: [
        {
          id: "ahmed-hassan",
          name: "Prof. Ahmed Hassan",
          position: "Department Head & Professor",
          email: "ahmed.hassan@aastu.edu.et",
          phone: "+251-11-123-4570",
          specialization: "Power Systems, Renewable Energy",
          experience: "18 years",
          courses: ["Power Systems", "Renewable Energy", "Electrical Machines"],
          documents: 52,
          students: 110,
          rating: 4.9,
          publications: 28,
          joinDate: "2006-03-10",
        },
        {
          id: "lisa-wang",
          name: "Dr. Lisa Wang",
          position: "Associate Professor",
          email: "lisa.wang@aastu.edu.et",
          phone: "+251-11-123-4571",
          specialization: "Control Systems, Automation",
          experience: "10 years",
          courses: ["Control Systems", "Industrial Automation", "Robotics"],
          documents: 35,
          students: 88,
          rating: 4.5,
          publications: 19,
          joinDate: "2014-07-15",
        },
      ],
    },
    {
      id: "me",
      name: "Mechanical Engineering",
      code: "ME",
      head: "Dr. Emily Davis",
      teachers: 32,
      students: 692,
      documents: 1789,
      courses: 42,
      performance: 96.1,
      faculty: [
        {
          id: "robert-smith",
          name: "Dr. Robert Smith",
          position: "Professor",
          email: "robert.smith@aastu.edu.et",
          phone: "+251-11-123-4572",
          specialization: "Thermodynamics, Heat Transfer",
          experience: "20 years",
          courses: ["Thermodynamics", "Heat Transfer", "Energy Systems"],
          documents: 48,
          students: 125,
          rating: 4.8,
          publications: 35,
          joinDate: "2004-01-12",
        },
      ],
    },
  ]

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 95) return "bg-green-100 text-green-800"
    if (performance >= 90) return "bg-blue-100 text-blue-800"
    if (performance >= 85) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredDepartments = facultyTree.filter((dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
                <h1 className="text-2xl font-bold text-gray-900">Faculty Tree</h1>
                <p className="text-sm text-gray-600">Department-wise Faculty with Detailed Statistics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate Faculty Report
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
        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Faculty Tree Structure</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search departments or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Department Tree with Faculty */}
        <div className="grid gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <CardDescription>Department Code: {dept.code}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getPerformanceBadge(dept.performance)}>{dept.performance}% Performance</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Department Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{dept.teachers}</p>
                    <p className="text-sm text-gray-600">Faculty Members</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-600">{dept.students}</p>
                    <p className="text-sm text-gray-600">Students</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{dept.documents}</p>
                    <p className="text-sm text-gray-600">Documents</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">{dept.courses}</p>
                    <p className="text-sm text-gray-600">Active Courses</p>
                  </div>
                </div>

                {/* Department Head Info */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/generic-placeholder-icon.png" />
                        <AvatarFallback>
                          {dept.head
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{dept.head}</p>
                        <p className="text-sm text-gray-600">Department Head</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDepartment(selectedDepartment === dept.id ? null : dept.id)}
                      >
                        {selectedDepartment === dept.id ? "Hide Faculty" : "View Faculty"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Faculty List */}
                {selectedDepartment === dept.id && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Department Faculty</h4>
                    {dept.faculty.map((faculty) => (
                      <div key={faculty.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="/generic-placeholder-icon.png" />
                              <AvatarFallback>
                                {faculty.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h5 className="font-semibold text-gray-900">{faculty.name}</h5>
                              <p className="text-sm text-gray-600">{faculty.position}</p>
                              <p className="text-sm text-blue-600">{faculty.specialization}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedFaculty(selectedFaculty === faculty.id ? null : faculty.id)}
                            >
                              {selectedFaculty === faculty.id ? "Hide Details" : "View Details"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>

                        {/* Faculty Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="text-center">
                            <p className="font-semibold text-blue-600">{faculty.documents}</p>
                            <p className="text-gray-600">Documents</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-emerald-600">{faculty.students}</p>
                            <p className="text-gray-600">Students</p>
                          </div>
                          <div className="text-center">
                            <p className={`font-semibold ${getRatingColor(faculty.rating)}`}>{faculty.rating}/5.0</p>
                            <p className="text-gray-600">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-purple-600">{faculty.publications}</p>
                            <p className="text-gray-600">Publications</p>
                          </div>
                        </div>

                        {/* Detailed Faculty Information */}
                        {selectedFaculty === faculty.id && (
                          <div className="mt-4 p-4 bg-white rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-3">Contact Information</h6>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{faculty.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{faculty.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>Joined: {faculty.joinDate}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4 text-gray-500" />
                                    <span>Experience: {faculty.experience}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-3">Teaching Load</h6>
                                <div className="space-y-2">
                                  {faculty.courses.map((course, index) => (
                                    <Badge key={index} variant="outline" className="mr-2 mb-1">
                                      {course}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="mt-4 flex items-center space-x-4 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Award className="h-4 w-4 text-yellow-500" />
                                    <span className="font-medium">Publications: {faculty.publications}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <UserCheck className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">Rating: {faculty.rating}/5.0</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
