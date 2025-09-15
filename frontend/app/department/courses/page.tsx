"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, User, Calendar, Award, Mail, Plus } from "lucide-react"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { apiClient } from "@/lib/api"

interface Course {
  id: number
  course_code: string
  course_name: string
  description: string
  credits: number
  level: string
  semester: string
  academic_year: number
  teacher?: {
    id: number
    name: string
    email: string
  }
  department?: {
    id: number
    name: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DepartmentCourses() {
  const [user, setUser] = useState<{
    id: number
    name: string
    email: string
    role: string
    department?: string
    student_id?: string
    department_id?: number
  } | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [semesterFilter, setSemesterFilter] = useState<string>("all")

  useEffect(() => {
    loadUserData()
    loadCourses()
  }, [])

  const loadUserData = () => {
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
  }

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.getDepartmentCourses()
      if (response.success) {
        setCourses(response.data || [])
      } else {
        setError(response.message || 'Failed to load courses')
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || course.level === levelFilter
    const matchesSemester = semesterFilter === "all" || course.semester === semesterFilter
    
    return matchesSearch && matchesLevel && matchesSemester
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'undergraduate': return 'bg-blue-100 text-blue-800'
      case 'graduate': return 'bg-green-100 text-green-800'
      case 'phd': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSemesterColor = (semester: string) => {
    switch (semester) {
      case '1': return 'bg-orange-100 text-orange-800'
      case '2': return 'bg-yellow-100 text-yellow-800'
      case 'summer': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadCourses} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Department Courses"
        subtitle="Manage and view department courses"
        backUrl="/department/dashboard"
        user={user}
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Department Courses</h1>
              <p className="text-gray-600 mt-1">View and manage all courses in your department</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || levelFilter !== "all" || semesterFilter !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "There are no courses in your department yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{course.course_name}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {course.course_code}
                        </Badge>
                        <Badge className={getLevelColor(course.level)}>
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </Badge>
                        <Badge className={getSemesterColor(course.semester)}>
                          Semester {course.semester}
                        </Badge>
                        {course.is_active ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          {course.credits} Credits
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Year {course.academic_year}
                        </span>
                        {course.teacher && (
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {course.teacher.name}
                          </span>
                        )}
                      </div>
                      
                      {course.description && (
                        <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      )}
                      
                      {course.teacher && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a 
                            href={`mailto:${course.teacher.email}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {course.teacher.email}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      
                      {course.teacher && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          onClick={() => window.open(`mailto:${course.teacher.email}`, '_blank')}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Email Teacher
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}