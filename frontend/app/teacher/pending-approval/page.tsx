"use client"

"use client"

"use client"

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, AlertCircle, Eye, Calendar, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

interface Document {
  id: number
  title: string
  author: string
  description: string
  document_type: string
  status: string
  file_path: string
  created_at: string
  updated_at: string
  department?: {
    id: number
    name: string
  }
  category?: {
    id: number
    name: string
  }
}

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
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "under_review":
      return "bg-blue-100 text-blue-800"
    case "approved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getDocumentTypeLabel = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default function PendingApproval() {
  const [activeTab, setActiveTab] = useState("pending")
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
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

    const loadPendingDocuments = async () => {
      try {
        const response = await apiClient.getTeacherPendingApproval()
        if (response.success && response.data) {
          setDocuments(response.data)
        }
      } catch (error) {
        console.error('Error loading pending documents:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPendingDocuments()
  }, [])

  const pendingDocs = documents.filter((doc) => doc.status === "pending")
  const underReviewDocs = documents.filter((doc) => doc.status === "under_review")
  const approvedDocs = documents.filter((doc) => doc.status === "approved")
  const rejectedDocs = documents.filter((doc) => doc.status === "rejected")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PageHeader 
        title="Pending Approval"
        subtitle="Track documents awaiting department approval"
        showBackButton={true}
        backUrl="/teacher/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingDocs.length}</div>
              <p className="text-xs text-gray-600">Awaiting initial review</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Under Review</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{underReviewDocs.length}</div>
              <p className="text-xs text-gray-600">Being reviewed by department</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Approved</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedDocs.length}</div>
              <p className="text-xs text-gray-600">Successfully approved</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Rejected</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedDocs.length}</div>
              <p className="text-xs text-gray-600">Requires revision</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending ({pendingDocs.length})</TabsTrigger>
            <TabsTrigger value="under-review">Under Review ({underReviewDocs.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedDocs.length})</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
                <CardTitle className="flex items-center text-yellow-900">
                  <AlertCircle className="h-5 w-5 text-yellow-600 " />
                  Documents Pending Approval
                </CardTitle>
                <CardDescription className="text-yellow-700">Documents waiting to be reviewed by the department head</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {pendingDocs.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents pending approval</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-6 border border-yellow-200 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                            <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Author: {doc.author}</p>
                          {doc.department && <p className="text-sm text-gray-600 mb-1">Department: {doc.department.name}</p>}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Uploaded: {formatDate(doc.created_at)}</span>
                            <span>Last updated: {formatDate(doc.updated_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {getDocumentTypeLabel(doc.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="under-review" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-blue-900">
                  <Eye className="h-5 w-5 text-blue-600 " />
                  Documents Under Review
                </CardTitle>
                <CardDescription className="text-blue-700">Documents currently being reviewed by department heads</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {underReviewDocs.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents under review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {underReviewDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-6 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                            <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Author: {doc.author}</p>
                          {doc.department && <p className="text-sm text-gray-600 mb-1">Department: {doc.department.name}</p>}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Uploaded: {formatDate(doc.created_at)}</span>
                            <span>Last updated: {formatDate(doc.updated_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {getDocumentTypeLabel(doc.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-900">
                  <Calendar className="h-5 w-5 text-green-600 " />
                  Approved Documents
                </CardTitle>
                <CardDescription className="text-green-700">Documents that have been successfully approved</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {approvedDocs.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No approved documents yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-6 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                            <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Author: {doc.author}</p>
                          {doc.department && <p className="text-sm text-gray-600 mb-1">Department: {doc.department.name}</p>}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Uploaded: {formatDate(doc.created_at)}</span>
                            <span>Approved: {formatDate(doc.updated_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {getDocumentTypeLabel(doc.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Document Approval Workflow</CardTitle>
                <CardDescription className="text-purple-700">Understanding the approval process for your uploaded documents</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                <CardTitle className="text-amber-900">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
      
      <Footer />
    </div>
  )
}
