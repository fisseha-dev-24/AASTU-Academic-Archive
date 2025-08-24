"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Eye, Download, Edit, Search, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const myDocuments = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    course: "Artificial Intelligence",
    status: "approved",
    views: 245,
    downloads: 89,
    uploadedAt: "2024-01-10T14:20:00Z",
    approvedAt: "2024-01-11T09:30:00Z",
    type: "lecture_notes",
    size: "4.2 MB",
  },
  {
    id: 2,
    title: "Web Development Framework Comparison",
    course: "Web Development",
    status: "approved",
    views: 189,
    downloads: 67,
    uploadedAt: "2024-01-08T11:15:00Z",
    approvedAt: "2024-01-09T16:45:00Z",
    type: "reference_material",
    size: "2.8 MB",
  },
  {
    id: 3,
    title: "Database Normalization Tutorial",
    course: "Database Systems",
    status: "rejected",
    reason: "Content needs more detailed examples",
    uploadedAt: "2024-01-05T13:30:00Z",
    reviewedAt: "2024-01-07T10:20:00Z",
    type: "tutorial",
    size: "1.9 MB",
  },
  {
    id: 4,
    title: "Advanced Database Design - Lecture Notes",
    course: "Database Systems",
    status: "pending_approval",
    uploadedAt: "2024-01-15T10:30:00Z",
    type: "lecture_notes",
    size: "2.4 MB",
  },
  {
    id: 5,
    title: "Software Engineering Best Practices",
    course: "Software Engineering",
    status: "under_review",
    uploadedAt: "2024-01-14T16:45:00Z",
    type: "reference_material",
    size: "1.8 MB",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800"
    case "pending_approval":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "under_review":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MyDocuments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")

  const filteredDocuments = myDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesCourse = courseFilter === "all" || doc.course === courseFilter
    return matchesSearch && matchesStatus && matchesCourse
  })

  const stats = {
    total: myDocuments.length,
    approved: myDocuments.filter((d) => d.status === "approved").length,
    pending: myDocuments.filter((d) => d.status === "pending_approval" || d.status === "under_review").length,
    rejected: myDocuments.filter((d) => d.status === "rejected").length,
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
                <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
                <p className="text-sm text-gray-600">Manage your uploaded course materials</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
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
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <FileText className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Database Systems">Database Systems</SelectItem>
                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
            <CardDescription>Your uploaded course materials and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <Badge variant="outline">{doc.type.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Course: {doc.course}</p>
                    <p className="text-sm text-gray-500 mb-2">Size: {doc.size}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      {doc.approvedAt && <span>Approved: {new Date(doc.approvedAt).toLocaleDateString()}</span>}
                      {doc.reviewedAt && <span>Reviewed: {new Date(doc.reviewedAt).toLocaleDateString()}</span>}
                    </div>
                    {doc.status === "approved" && (
                      <div className="flex items-center space-x-4 mt-2 text-sm text-green-600">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {doc.views} views
                        </span>
                        <span className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {doc.downloads} downloads
                        </span>
                      </div>
                    )}
                    {doc.status === "rejected" && doc.reason && (
                      <p className="text-sm text-red-600 mt-2">Reason: {doc.reason}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(doc.status)}>{doc.status.replace("_", " ")}</Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {doc.status === "approved" && (
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      )}
                      {doc.status === "rejected" && (
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Resubmit
                        </Button>
                      )}
                    </div>
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
