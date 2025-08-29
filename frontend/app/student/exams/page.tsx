"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileQuestion, Search, Download, Eye, Calendar, Clock, Filter } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
}

interface ExamMaterial {
  id: number
  title: string
  course: string
  year: string
  semester: string
  department: string
  type: string
  hasAnswers: boolean
  uploadDate: string
  downloads: number
}

export default function ExamMaterialsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [examMaterials, setExamMaterials] = useState<ExamMaterial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
    
    loadExamMaterials()
  }, [searchQuery, selectedYear, selectedDepartment])

  const loadExamMaterials = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchQuery) params.search_query = searchQuery
      if (selectedYear && selectedYear !== "all") params.year = selectedYear
      if (selectedDepartment && selectedDepartment !== "all") params.department = selectedDepartment

      const response = await apiClient.getExamMaterials(params)
      
      if (response.success && response.data) {
        setExamMaterials(response.data)
      }
    } catch (error) {
      console.error('Error loading exam materials:', error)
      setExamMaterials([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewExam = async (examId: number) => {
    try {
      await apiClient.previewDocument(examId)
      console.log('Exam preview opened:', examId)
    } catch (error) {
      console.error('Error previewing exam:', error)
      toast.error('Failed to preview exam')
    }
  }

  const handleDownloadExam = async (examId: number) => {
    try {
      await apiClient.downloadDocument(examId)
      console.log('Exam download started:', examId)
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading exam:', error)
      toast.error('Failed to download exam')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Exam Materials"
        subtitle="Past papers and model solutions"
        backUrl="/student/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5  text-purple-600" />
              Search & Filter
            </CardTitle>
            <CardDescription>Find specific exam materials by course, year, or department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by course name, code, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                  <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? "Loading..." : `${examMaterials.length} exam material${examMaterials.length !== 1 ? "s" : ""} found`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading exam materials...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {examMaterials.map((exam) => (
                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <FileQuestion className="h-4 w-4 mr-1" />
                            {exam.course}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {exam.year} - {exam.semester}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {exam.uploadDate}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {exam.downloads} downloads
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Badge variant="secondary">{exam.department}</Badge>
                          <Badge variant={exam.hasAnswers ? "default" : "outline"}>
                            {exam.hasAnswers ? "With Answers" : "No Answers"}
                          </Badge>
                          <Badge variant="outline">{exam.type}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <Button size="sm" onClick={() => handleViewExam(exam.id)}>
                          <Eye className="h-4 w-4 " />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadExam(exam.id)}>
                          <Download className="h-4 w-4 " />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && examMaterials.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileQuestion className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exam materials found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
