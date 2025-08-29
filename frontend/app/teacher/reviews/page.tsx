"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, Download, Clock, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data for submissions
const submissions = [
  {
    id: 1,
    title: "Data Structures Assignment - Final Project",
    student: "Abebe Kebede",
    studentId: "AASTU/2021/CS/001",
    course: "Data Structures & Algorithms",
    courseCode: "CS301",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    type: "assignment",
    fileSize: "2.5 MB",
    description:
      "Implementation of various data structures including trees, graphs, and hash tables with performance analysis.",
  },
  {
    id: 2,
    title: "Database Design Report",
    student: "Hanan Mohammed",
    studentId: "AASTU/2021/CS/045",
    course: "Database Systems",
    courseCode: "CS302",
    submittedAt: "2024-01-14T16:45:00Z",
    status: "under_review",
    type: "report",
    fileSize: "1.8 MB",
    description: "Comprehensive database design for an e-commerce system with normalization and optimization.",
  },
  {
    id: 3,
    title: "Software Engineering Thesis Proposal",
    student: "Dawit Tadesse",
    studentId: "AASTU/2020/CS/023",
    course: "Software Engineering",
    courseCode: "CS401",
    submittedAt: "2024-01-14T09:15:00Z",
    status: "pending",
    type: "thesis",
    fileSize: "3.2 MB",
    description: "Proposal for developing a mobile application for student course management system.",
  },
  {
    id: 4,
    title: "Web Development Portfolio",
    student: "Sara Ahmed",
    studentId: "AASTU/2021/CS/067",
    course: "Web Development",
    courseCode: "CS303",
    submittedAt: "2024-01-13T14:20:00Z",
    status: "pending",
    type: "project",
    fileSize: "5.1 MB",
    description: "Complete web application portfolio showcasing various technologies and frameworks.",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "under_review":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TeacherReviews() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [reviewAction, setReviewAction] = useState("")
  const [reviewComments, setReviewComments] = useState("")

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    const matchesCourse = courseFilter === "all" || submission.courseCode === courseFilter

    return matchesSearch && matchesStatus && matchesCourse
  })

  const handleReviewSubmit = () => {
    // Handle review submission logic here
    console.log("Review submitted:", { action: reviewAction, comments: reviewComments })
    setSelectedSubmission(null)
    setReviewAction("")
    setReviewComments("")
  }

  const courses = [...new Set(submissions.map((s) => ({ code: s.courseCode, name: s.course })))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search submissions..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.code} value={course.code}>
                        {course.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full bg-transparent">
                  <Filter className="h-4 w-4 " />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{submission.title}</h3>
                      <Badge variant="outline">{submission.type}</Badge>
                      <Badge className={getStatusColor(submission.status)}>{submission.status.replace("_", " ")}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Student:</span> {submission.student}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">ID:</span> {submission.studentId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Course:</span> {submission.course}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Submitted:</span>{" "}
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">{submission.description}</p>

                    <div className="flex items-center text-sm text-gray-500">
                      <span>File size: {submission.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Review Submission</DialogTitle>
                        </DialogHeader>
                        {selectedSubmission && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900">{selectedSubmission.title}</h4>
                              <p className="text-sm text-gray-600">by {selectedSubmission.student}</p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Review Decision</label>
                              <Select value={reviewAction} onValueChange={setReviewAction}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approve">Approve</SelectItem>
                                  <SelectItem value="reject">Reject</SelectItem>
                                  <SelectItem value="request_changes">Request Changes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                              <Textarea
                                value={reviewComments}
                                onChange={(e) => setReviewComments(e.target.value)}
                                placeholder="Provide feedback to the student..."
                                rows={4}
                              />
                            </div>

                            <div className="flex justify-end space-x-3">
                              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleReviewSubmit}
                                disabled={!reviewAction}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Submit Review
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-600">No submissions match your current filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
