"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, FileQuestion, Search, Download, Eye, Calendar, Clock, Filter } from "lucide-react"
import Link from "next/link"

export default function ExamMaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")

  const examMaterials = [
    {
      id: 1,
      title: "Software Engineering Final Exam",
      course: "SE 301",
      year: "2023",
      semester: "Fall",
      department: "Software Engineering",
      type: "Final Exam",
      hasAnswers: true,
      uploadDate: "2024-01-15",
      downloads: 145,
    },
    {
      id: 2,
      title: "Database Systems Midterm",
      course: "CS 205",
      year: "2023",
      semester: "Spring",
      department: "Computer Science",
      type: "Midterm",
      hasAnswers: true,
      uploadDate: "2024-01-10",
      downloads: 98,
    },
    {
      id: 3,
      title: "Computer Networks Quiz Collection",
      course: "IT 301",
      year: "2022",
      semester: "Fall",
      department: "Information Technology",
      type: "Quiz",
      hasAnswers: false,
      uploadDate: "2024-01-08",
      downloads: 67,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Exam Materials</h1>
                <p className="text-sm text-gray-600">Past papers and model solutions</p>
              </div>
            </div>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-purple-600" />
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
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software Engineering</SelectItem>
                  <SelectItem value="computer">Computer Science</SelectItem>
                  <SelectItem value="information">Information Technology</SelectItem>
                  <SelectItem value="electrical">Electrical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exam Materials List */}
        <div className="space-y-6">
          {examMaterials.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileQuestion className="h-6 w-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{exam.course}</span>
                      <span>•</span>
                      <span>{exam.department}</span>
                      <span>•</span>
                      <span>
                        {exam.year} {exam.semester}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <Badge
                        variant={
                          exam.type === "Final Exam" ? "default" : exam.type === "Midterm" ? "secondary" : "outline"
                        }
                      >
                        {exam.type}
                      </Badge>
                      {exam.hasAnswers && (
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          ✓ Answer Key Available
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Uploaded {exam.uploadDate}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {exam.downloads} downloads
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {exam.hasAnswers && (
                      <Button variant="outline" size="sm" className="text-green-700 border-green-300 bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Answers
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Categories */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <FileQuestion className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Final Exams</h4>
                <p className="text-sm text-gray-500">12 papers</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Midterms</h4>
                <p className="text-sm text-gray-500">8 papers</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Search className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Quizzes</h4>
                <p className="text-sm text-gray-500">15 collections</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Download className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Practice Tests</h4>
                <p className="text-sm text-gray-500">6 sets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
