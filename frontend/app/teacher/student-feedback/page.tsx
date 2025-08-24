"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, MessageSquare, TrendingUp, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const feedbackData = [
  {
    id: 1,
    student: "Abebe Kebede",
    studentId: "AASTU/2021/CS/001",
    course: "Data Structures & Algorithms",
    document: "Introduction to Trees and Graphs",
    rating: 5,
    comment: "Excellent explanation with clear examples. The diagrams really helped me understand the concepts.",
    submittedAt: "2024-01-15T10:30:00Z",
    helpful: true,
  },
  {
    id: 2,
    student: "Hanan Mohammed",
    studentId: "AASTU/2021/CS/045",
    course: "Database Systems",
    document: "Database Normalization Tutorial",
    rating: 4,
    comment:
      "Good content but could use more practical examples. Overall very helpful for understanding normalization.",
    submittedAt: "2024-01-14T16:45:00Z",
    helpful: true,
  },
  {
    id: 3,
    student: "Dawit Tadesse",
    studentId: "AASTU/2020/CS/023",
    course: "Software Engineering",
    document: "Agile Development Methodology",
    rating: 5,
    comment: "Perfect timing for our project. The real-world examples made it easy to apply in practice.",
    submittedAt: "2024-01-14T09:15:00Z",
    helpful: true,
  },
  {
    id: 4,
    student: "Sara Ahmed",
    studentId: "AASTU/2021/CS/067",
    course: "Web Development",
    document: "React Hooks Deep Dive",
    rating: 3,
    comment: "Content is good but the examples could be more beginner-friendly. Some concepts were hard to follow.",
    submittedAt: "2024-01-13T14:20:00Z",
    helpful: false,
  },
]

const overallStats = {
  averageRating: 4.3,
  totalFeedback: 156,
  positiveRating: 89,
  helpfulPercentage: 92,
}

export default function StudentFeedback() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesSearch =
      feedback.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = courseFilter === "all" || feedback.course === courseFilter
    const matchesRating = ratingFilter === "all" || feedback.rating.toString() === ratingFilter

    return matchesSearch && matchesCourse && matchesRating
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/teacher/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Feedback</h1>
                <p className="text-sm text-gray-600">Review feedback and ratings from students</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Export Report
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>DT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{overallStats.averageRating}/5.0</div>
              <div className="flex mt-1">{renderStars(Math.round(overallStats.averageRating))}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{overallStats.totalFeedback}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Ratings</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{overallStats.positiveRating}%</div>
              <p className="text-xs text-gray-600">4+ star ratings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Helpful Content</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{overallStats.helpfulPercentage}%</div>
              <p className="text-xs text-gray-600">Marked as helpful</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="Data Structures & Algorithms">Data Structures</SelectItem>
                  <SelectItem value="Database Systems">Database Systems</SelectItem>
                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback ({filteredFeedback.length})</CardTitle>
            <CardDescription>Student feedback and ratings for your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{feedback.student}</h4>
                        <Badge variant="outline">{feedback.studentId}</Badge>
                        <div className="flex items-center space-x-1">
                          {renderStars(feedback.rating)}
                          <span className="text-sm text-gray-600 ml-2">({feedback.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Course: {feedback.course}</p>
                      <p className="text-sm text-gray-600 mb-3">Document: {feedback.document}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{new Date(feedback.submittedAt).toLocaleDateString()}</p>
                      {feedback.helpful && <Badge className="bg-green-100 text-green-800 mt-1">Helpful</Badge>}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
