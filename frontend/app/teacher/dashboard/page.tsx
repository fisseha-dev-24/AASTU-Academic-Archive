"use client"
import Link from "next/link"
import {
  FileText,
  Clock,
  Eye,
  Download,
  Upload,
  BarChart3,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for teacher dashboard
const teacherStats = {
  totalDocuments: 156,
  pendingApproval: 8,
  approvedDocuments: 142,
  rejectedDocuments: 6,
  totalStudents: 89,
  coursesManaged: 4,
  monthlyViews: 2847,
  studentFeedback: 4.8,
}

const pendingApprovalDocs = [
  {
    id: 1,
    title: "Advanced Database Design - Lecture Notes",
    course: "Database Systems",
    uploadedAt: "2024-01-15T10:30:00Z",
    status: "pending_approval",
    type: "lecture_notes",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Software Engineering Best Practices",
    course: "Software Engineering",
    uploadedAt: "2024-01-14T16:45:00Z",
    status: "under_review",
    type: "reference_material",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Data Structures Assignment Solutions",
    course: "Data Structures & Algorithms",
    uploadedAt: "2024-01-14T09:15:00Z",
    status: "pending_approval",
    type: "assignment_solution",
    size: "3.2 MB",
  },
]

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
  },
  {
    id: 3,
    title: "Database Normalization Tutorial",
    course: "Database Systems",
    status: "rejected",
    reason: "Content needs more detailed examples",
    uploadedAt: "2024-01-05T13:30:00Z",
    reviewedAt: "2024-01-07T10:20:00Z",
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

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">Computer Science Department</p>
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
              <div className="text-sm">
                <p className="font-medium text-gray-900">Dr. Tekle Woldemariam</p>
                <p className="text-gray-500">Computer Science Department</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{teacherStats.totalDocuments}</div>
              <p className="text-xs text-gray-600">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{teacherStats.pendingApproval}</div>
              <p className="text-xs text-gray-600">Awaiting department approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{teacherStats.monthlyViews.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Document views this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student Rating</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{teacherStats.studentFeedback}/5.0</div>
              <p className="text-xs text-gray-600">Average feedback score</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/teacher/upload">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">Upload Documents</CardTitle>
                <CardDescription>Upload new course materials and resources</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/my-documents">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-emerald-200 hover:border-emerald-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-600">My Documents</CardTitle>
                <CardDescription>View and manage your uploaded documents</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/pending-approval">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-200 hover:border-yellow-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-600">Pending Approval</CardTitle>
                <CardDescription>Track documents awaiting department approval</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 hover:border-purple-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">Analytics</CardTitle>
                <CardDescription>View document performance and statistics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/student-feedback">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-indigo-200 hover:border-indigo-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-indigo-600">Student Feedback</CardTitle>
                <CardDescription>Review feedback and ratings from students</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/teacher/schedule">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-teal-200 hover:border-teal-400">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle className="text-teal-600">Class Schedule</CardTitle>
                <CardDescription>Manage your teaching schedule and deadlines</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Pending Approval Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  Documents Pending Approval ({teacherStats.pendingApproval})
                </CardTitle>
                <CardDescription>
                  Documents waiting for department head approval before being visible to students
                </CardDescription>
              </div>
              <Link href="/teacher/pending-approval">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovalDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-yellow-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-600">Course: {doc.course}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} • Size: {doc.size}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(doc.status)}>{doc.status.replace("_", " ")}</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your recently uploaded documents and their approval status</CardDescription>
              </div>
              <Link href="/teacher/my-documents">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-600">Course: {doc.course}</p>
                    {doc.status === "approved" && (
                      <p className="text-xs text-gray-500">
                        Views: {doc.views} • Downloads: {doc.downloads}
                      </p>
                    )}
                    {doc.status === "rejected" && <p className="text-xs text-red-600">Reason: {doc.reason}</p>}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
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
