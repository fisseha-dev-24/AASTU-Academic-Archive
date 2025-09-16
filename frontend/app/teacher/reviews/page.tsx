"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Clock, Filter, Search, CheckCircle, XCircle, AlertCircle, User, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

const getTypeColor = (type: string) => {
  switch (type) {
    case "approval":
      return "bg-green-100 text-green-800"
    case "rejection":
      return "bg-red-100 text-red-800"
    case "general":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "approval":
      return <CheckCircle className="h-4 w-4" />
    case "rejection":
      return <XCircle className="h-4 w-4" />
    case "general":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

export default function TeacherReviews() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [readFilter, setReadFilter] = useState("all")
  const [comments, setComments] = useState<Array<{
    id: number;
    comment: string;
    type: string;
    is_read: boolean;
    created_at: string;
    document: {
      id: number;
      title: string;
    };
    fromUser: {
      id: number;
      name: string;
      email: string;
    };
  }>>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{
    id: number
    name: string
    email: string
    role: string
    department?: string
    student_id?: string
    department_id?: number
  } | null>(null)

  // Load user data
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
  }, [])

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTeacherComments()
      if (response.success) {
        setComments(response.data || [])
      } else {
        console.error('Failed to load comments:', response.message)
        setComments([])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  const filteredComments = comments.filter((comment) => {
    const matchesSearch = 
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.fromUser.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || comment.type === typeFilter
    const matchesRead = readFilter === "all" || 
      (readFilter === "read" && comment.is_read) ||
      (readFilter === "unread" && !comment.is_read)

    return matchesSearch && matchesType && matchesRead
  })

  const handleMarkAsRead = async (commentId: number) => {
    try {
      const response = await apiClient.markCommentAsRead(commentId)
      if (response.success) {
        // Update local state
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_read: true }
            : comment
        ))
      }
    } catch (error) {
      console.error('Error marking comment as read:', error)
    }
  }

  const handlePreviewDocument = async (documentId: number) => {
    try {
      await apiClient.previewTeacherDocument(documentId)
    } catch (error) {
      console.error('Error previewing document:', error)
      alert('Failed to preview document. Please try again.')
    }
  }

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await apiClient.downloadTeacherDocument(documentId)
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Failed to download document. Please try again.')
    }
  }

  const unreadCount = comments.filter(comment => !comment.is_read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Department Feedback"
        subtitle={`Feedback from department heads on your document submissions ${unreadCount > 0 ? `(${unreadCount} new feedback items)` : ''}`}
        backUrl="/teacher/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Banner */}
        {unreadCount > 0 && (
          <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    You have {unreadCount} new feedback item{unreadCount > 1 ? 's' : ''} from department heads
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Review the feedback below and take any necessary actions on your documents.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Comments</CardTitle>
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
                    placeholder="Search comments..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="rejection">Rejection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={readFilter} onValueChange={setReadFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Comments</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearchTerm("")
                    setTypeFilter("all")
                    setReadFilter("all")
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading comments...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
                <p className="text-gray-600">No comments match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredComments.map((comment) => (
              <Card 
                key={comment.id} 
                className={`hover:shadow-md transition-shadow ${!comment.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(comment.type)}
                          <Badge className={getTypeColor(comment.type)}>
                            {comment.type.charAt(0).toUpperCase() + comment.type.slice(1)}
                          </Badge>
                        </div>
                        {!comment.is_read && (
                          <Badge className="bg-blue-100 text-blue-800">
                            New
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Document:</span>
                          <span className="text-sm text-gray-900">{comment.document.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">From:</span>
                          <span className="text-sm text-gray-900">{comment.fromUser.name}</span>
                          <span className="text-sm text-gray-500">({comment.fromUser.email})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border-l-4 ${
                        comment.type === 'approval' ? 'bg-green-50 border-green-400' :
                        comment.type === 'rejection' ? 'bg-red-50 border-red-400' :
                        'bg-blue-50 border-blue-400'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-sm font-medium ${
                            comment.type === 'approval' ? 'text-green-800' :
                            comment.type === 'rejection' ? 'text-red-800' :
                            'text-blue-800'
                          }`}>
                            {comment.type === 'approval' ? '✓ Approval Feedback' :
                             comment.type === 'rejection' ? '✗ Rejection Feedback' :
                             '💬 General Feedback'}
                          </span>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{comment.comment}</p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      {!comment.is_read && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleMarkAsRead(comment.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePreviewDocument(comment.document.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadDocument(comment.document.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
