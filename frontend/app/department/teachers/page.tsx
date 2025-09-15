"use client"

"use client"

"use client"

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
import { apiClient } from "@/lib/api"

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
  const [teachers, setTeachers] = useState<Array<{
    id: number;
    name: string;
    email: string;
    department: string;
    created_at: string;
    stats: {
      total_documents: number;
      approved_documents: number;
      pending_documents: number;
      rejected_documents: number;
    };
  }>>([])
  const [loading, setLoading] = useState(true)

  // Load user data and teachers
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
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getDepartmentFaculty()
      if (response.success) {
        setTeachers(response.data || [])
      } else {
        console.error('Failed to load teachers:', response.message)
        setTeachers([])
      }
    } catch (error) {
      console.error('Error loading teachers:', error)
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }

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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading teachers...</p>
            </div>
          ) : teachers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
                <p className="text-gray-600">There are no teachers in your department yet.</p>
              </CardContent>
            </Card>
          ) : (
            teachers.map((teacher) => (
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
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              <a 
                                href={`mailto:${teacher.email}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                {teacher.email}
                              </a>
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-2" />
                              {teacher.department || 'Department'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Joined: {new Date(teacher.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              {teacher.stats?.total_documents || 0} documents uploaded
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <p className="font-semibold text-blue-600">{teacher.stats?.approved_documents || 0}</p>
                              <p className="text-xs text-gray-600">Approved</p>
                            </div>
                            <div className="text-center p-2 bg-yellow-50 rounded">
                              <p className="font-semibold text-yellow-600">{teacher.stats?.pending_documents || 0}</p>
                              <p className="text-xs text-gray-600">Pending</p>
                            </div>
                            <div className="text-center p-2 bg-red-50 rounded">
                              <p className="font-semibold text-red-600">{teacher.stats?.rejected_documents || 0}</p>
                              <p className="text-xs text-gray-600">Rejected</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-center mb-4">
                        <p className="text-3xl font-bold text-blue-600">{teacher.stats?.total_documents || 0}</p>
                        <p className="text-xs text-gray-600">Total Documents</p>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                          onClick={() => window.open(`mailto:${teacher.email}`, '_blank')}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
