"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Users, FileText, Settings, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Mock data for courses
const courses = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    code: "CS301",
    students: 32,
    documents: 45,
    pendingReviews: 5,
    description: "Comprehensive course covering fundamental data structures and algorithmic concepts.",
    semester: "Fall 2024",
    credits: 3,
  },
  {
    id: 2,
    name: "Database Systems",
    code: "CS302",
    students: 28,
    documents: 38,
    pendingReviews: 3,
    description: "Introduction to database design, SQL, and database management systems.",
    semester: "Fall 2024",
    credits: 3,
  },
  {
    id: 3,
    name: "Software Engineering",
    code: "CS401",
    students: 25,
    documents: 52,
    pendingReviews: 4,
    description: "Software development methodologies, project management, and best practices.",
    semester: "Fall 2024",
    credits: 4,
  },
  {
    id: 4,
    name: "Web Development",
    code: "CS303",
    students: 30,
    documents: 41,
    pendingReviews: 0,
    description: "Modern web development technologies including HTML, CSS, JavaScript, and frameworks.",
    semester: "Fall 2024",
    credits: 3,
  },
]

// Mock data for students
const students = [
  {
    id: 1,
    name: "Abebe Kebede",
    studentId: "AASTU/2021/CS/001",
    email: "abebe.kebede@aastu.edu.et",
    courses: ["CS301", "CS302"],
    submissions: 8,
    lastActive: "2024-01-15",
  },
  {
    id: 2,
    name: "Hanan Mohammed",
    studentId: "AASTU/2021/CS/045",
    email: "hanan.mohammed@aastu.edu.et",
    courses: ["CS302", "CS303"],
    submissions: 6,
    lastActive: "2024-01-14",
  },
  {
    id: 3,
    name: "Dawit Tadesse",
    studentId: "AASTU/2020/CS/023",
    email: "dawit.tadesse@aastu.edu.et",
    courses: ["CS401"],
    submissions: 12,
    lastActive: "2024-01-13",
  },
]

export default function TeacherManage() {
  const [activeTab, setActiveTab] = useState("courses")
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [isEditingCourse, setIsEditingCourse] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/teacher/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 border-l border-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Courses</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>
                          {course.code} • {course.semester}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-blue-600 mr-1" />
                        </div>
                        <p className="text-lg font-semibold text-blue-600">{course.students}</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FileText className="h-4 w-4 text-emerald-600 mr-1" />
                        </div>
                        <p className="text-lg font-semibold text-emerald-600">{course.documents}</p>
                        <p className="text-xs text-gray-600">Documents</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Settings className="h-4 w-4 text-yellow-600 mr-1" />
                        </div>
                        <p className="text-lg font-semibold text-yellow-600">{course.pendingReviews}</p>
                        <p className="text-xs text-gray-600">Pending</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <BookOpen className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Users className="h-4 w-4 mr-1" />
                        Students
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
              <div className="flex space-x-2">
                <Input placeholder="Search students..." className="w-64" />
                <Button variant="outline">Filter</Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>Students enrolled in your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.studentId}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <div className="flex space-x-2 mt-2">
                          {student.courses.map((courseCode) => (
                            <Badge key={courseCode} variant="outline" className="text-xs">
                              {courseCode}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{student.submissions} submissions</p>
                        <p className="text-xs text-gray-500">Last active: {student.lastActive}</p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Course Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">New submissions</label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Student messages</label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">System updates</label>
                    <input type="checkbox" className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Default Settings</CardTitle>
                  <CardDescription>Set default values for new courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Access Level</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Course Students Only</option>
                      <option>Department Wide</option>
                      <option>College Wide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto-approve submissions</label>
                    <input type="checkbox" className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
