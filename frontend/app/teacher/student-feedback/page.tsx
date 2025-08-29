"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Star, MessageSquare, TrendingUp, Search, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
}

interface Feedback {
  id: number
  student: string
  student_id: string
  course: string
  document: string
  rating: number
  comment: string
  submitted_at: string
  helpful: boolean
}

interface FeedbackStats {
  averageRating: number
  totalFeedback: number
  positiveRating: number
  helpfulPercentage: number
}

interface FeedbackData {
  feedback: Feedback[]
  stats: FeedbackStats
  courses: string[]
}

export default function StudentFeedback() {
  const [user, setUser] = useState<User | null>(null)
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  useEffect(() => {
    // Load user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo))
      } catch (e) {
        console.error('Failed to parse user info:', e)
      }
    }

    loadFeedbackData()
  }, [])

  const loadFeedbackData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getTeacherStudentFeedback()
      
      if (response.success) {
        setFeedbackData(response.data)
      } else {
        setError(response.message || 'Failed to load feedback data')
      }
    } catch (err) {
      console.error('Error loading feedback data:', err)
      setError('Failed to load feedback data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedback = feedbackData?.feedback.filter((feedback) => {
    const matchesSearch =
      feedback.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = courseFilter === "all" || feedback.course === courseFilter
    const matchesRating = ratingFilter === "all" || feedback.rating.toString() === ratingFilter

    return matchesSearch && matchesCourse && matchesRating
  }) || []

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
              </div>
      
      <Footer />
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PageHeader 
        title="Student Feedback"
        subtitle="Review feedback and ratings from students"
        showBackButton={true}
        backUrl="/teacher/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="text-sm font-medium text-yellow-800">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{feedbackData?.stats.averageRating || 0}/5.0</div>
              <div className="flex mt-1">{renderStars(Math.round(feedbackData?.stats.averageRating || 0))}</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-sm font-medium text-blue-800">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{feedbackData?.stats.totalFeedback || 0}</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="text-sm font-medium text-emerald-800">Positive Ratings</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-emerald-600">{feedbackData?.stats.positiveRating || 0}%</div>
              <p className="text-xs text-gray-600">4+ star ratings</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-sm font-medium text-purple-800">Helpful Content</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{feedbackData?.stats.helpfulPercentage || 0}%</div>
              <p className="text-xs text-gray-600">Marked as helpful</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle className="text-lg text-gray-900">Search & Filter Feedback</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all" className="text-gray-900 hover:bg-gray-100 cursor-pointer">All Courses</SelectItem>
                  {feedbackData?.courses.map((course) => (
                    <SelectItem key={course} value={course} className="text-gray-900 hover:bg-gray-100 cursor-pointer">
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-32 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all" className="text-gray-900 hover:bg-gray-100 cursor-pointer">All Ratings</SelectItem>
                  <SelectItem value="5" className="text-gray-900 hover:bg-gray-100 cursor-pointer">5 Stars</SelectItem>
                  <SelectItem value="4" className="text-gray-900 hover:bg-gray-100 cursor-pointer">4 Stars</SelectItem>
                  <SelectItem value="3" className="text-gray-900 hover:bg-gray-100 cursor-pointer">3 Stars</SelectItem>
                  <SelectItem value="2" className="text-gray-900 hover:bg-gray-100 cursor-pointer">2 Stars</SelectItem>
                  <SelectItem value="1" className="text-gray-900 hover:bg-gray-100 cursor-pointer">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle className="text-lg text-gray-900">Recent Feedback ({filteredFeedback.length})</CardTitle>
            <CardDescription>Student feedback and ratings for your documents</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                <p className="text-gray-600">No feedback matches your current search and filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFeedback.map((feedback) => (
                  <div key={feedback.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{feedback.student}</h4>
                          <Badge variant="outline" className="bg-gray-50">{feedback.student_id}</Badge>
                          <div className="flex items-center space-x-1">
                            {renderStars(feedback.rating)}
                            <span className="text-sm text-gray-600 ml-2">({feedback.rating}/5)</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Course: {feedback.course}</p>
                        <p className="text-sm text-gray-600 mb-3">Document: {feedback.document}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatDate(feedback.submitted_at)}</p>
                        {feedback.helpful && <Badge className="bg-green-100 text-green-800 mt-1">Helpful</Badge>}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
