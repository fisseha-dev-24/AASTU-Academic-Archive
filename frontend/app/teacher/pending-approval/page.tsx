"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, AlertCircle, Eye, Calendar, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pendingDocuments = [
  {
    id: 1,
    title: "Advanced Database Design - Lecture Notes",
    course: "Database Systems",
    uploadedAt: "2024-01-15T10:30:00Z",
    status: "pending_approval",
    type: "lecture_notes",
    size: "2.4 MB",
    priority: "high",
    estimatedReviewTime: "2-3 days",
  },
  {
    id: 2,
    title: "Software Engineering Best Practices",
    course: "Software Engineering",
    uploadedAt: "2024-01-14T16:45:00Z",
    status: "under_review",
    type: "reference_material",
    size: "1.8 MB",
    priority: "medium",
    estimatedReviewTime: "1-2 days",
    reviewer: "Dr. Alemayehu Tadesse",
  },
  {
    id: 3,
    title: "Data Structures Assignment Solutions",
    course: "Data Structures & Algorithms",
    uploadedAt: "2024-01-14T09:15:00Z",
    status: "pending_approval",
    type: "assignment_solution",
    size: "3.2 MB",
    priority: "low",
    estimatedReviewTime: "3-5 days",
  },
  {
    id: 4,
    title: "Machine Learning Algorithms Tutorial",
    course: "Artificial Intelligence",
    uploadedAt: "2024-01-13T14:20:00Z",
    status: "under_review",
    type: "tutorial",
    size: "5.1 MB",
    priority: "high",
    estimatedReviewTime: "1-2 days",
    reviewer: "Dr. Meron Zeleke",
  },
]

const approvalWorkflow = [
  {
    step: 1,
    title: "Document Upload",
    description: "Teacher uploads document to the system",
    status: "completed",
  },
  {
    step: 2,
    title: "Initial Review",
    description: "System checks document format and metadata",
    status: "completed",
  },
  {
    step: 3,
    title: "Department Review",
    description: "Department head reviews content and quality",
    status: "in_progress",
  },
  {
    step: 4,
    title: "Final Approval",
    description: "Document becomes visible to students",
    status: "pending",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending_approval":
      return "bg-yellow-100 text-yellow-800"
    case "under_review":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-orange-100 text-orange-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function PendingApproval() {
  const [activeTab, setActiveTab] = useState("pending")

  const pendingDocs = pendingDocuments.filter((doc) => doc.status === "pending_approval")
  const underReviewDocs = pendingDocuments.filter((doc) => doc.status === "under_review")

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
                <h1 className="text-2xl font-bold text-gray-900">Pending Approval</h1>
                <p className="text-sm text-gray-600">Track documents awaiting department approval</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingDocs.length}</div>
              <p className="text-xs text-gray-600">Awaiting initial review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{underReviewDocs.length}</div>
              <p className="text-xs text-gray-600">Being reviewed by department</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
              <Calendar className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">2.5</div>
              <p className="text-xs text-gray-600">Days average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Approval ({pendingDocs.length})</TabsTrigger>
            <TabsTrigger value="under-review">Under Review ({underReviewDocs.length})</TabsTrigger>
            <TabsTrigger value="workflow">Approval Workflow</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  Documents Pending Approval
                </CardTitle>
                <CardDescription>Documents waiting to be reviewed by the department head</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-6 border border-gray-200 rounded-lg bg-yellow-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{doc.title}</h4>
                          <Badge variant="outline">{doc.type.replace("_", " ")}</Badge>
                          <Badge className={getPriorityColor(doc.priority)}>{doc.priority} priority</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Course: {doc.course}</p>
                        <p className="text-sm text-gray-500 mb-2">Size: {doc.size}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          <span>Est. Review Time: {doc.estimatedReviewTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(doc.status)}>{doc.status.replace("_", " ")}</Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact Dept.
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="under-review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 text-blue-600 mr-2" />
                  Documents Under Review
                </CardTitle>
                <CardDescription>Documents currently being reviewed by department heads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {underReviewDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-6 border border-gray-200 rounded-lg bg-blue-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{doc.title}</h4>
                          <Badge variant="outline">{doc.type.replace("_", " ")}</Badge>
                          <Badge className={getPriorityColor(doc.priority)}>{doc.priority} priority</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Course: {doc.course}</p>
                        <p className="text-sm text-gray-500 mb-1">Size: {doc.size}</p>
                        {doc.reviewer && <p className="text-sm text-blue-600 mb-2">Reviewer: {doc.reviewer}</p>}
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          <span>Est. Review Time: {doc.estimatedReviewTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(doc.status)}>{doc.status.replace("_", " ")}</Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message Reviewer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Approval Workflow</CardTitle>
                <CardDescription>Understanding the approval process for your uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {approvalWorkflow.map((step, index) => (
                    <div key={step.step} className="flex items-start space-x-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : step.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        {step.status === "in_progress" && (
                          <p className="text-sm text-blue-600 mt-1">Currently in progress...</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Badge
                          className={
                            step.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : step.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {step.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p>Documents must be approved by the department head before becoming visible to students.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p>Review times may vary based on document complexity and department workload.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p>You can contact the department or reviewer for updates on your document status.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
