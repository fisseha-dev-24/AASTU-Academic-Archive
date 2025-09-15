"use client"

"use client"

"use client"

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Eye, Search, Download, ArrowLeft, Users, FileText, Calendar, Loader2, MessageSquare } from "lucide-react"
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

interface Document {
  id: number
  title: string
  teacher: string
  type: string
  submittedDate: string
  status: string
  priority: string
  author: string
  department: string
  category: string
  year: string
  file_path: string
  uploader_id: number
}

interface ApprovalStats {
  approved_this_month: number
  rejected_this_month: number
  pending_approval: number
}

export default function DocumentApproval() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<ApprovalStats>({
    approved_this_month: 0,
    rejected_this_month: 0,
    pending_approval: 0
  })
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<number | null>(null)
  const [rejecting, setRejecting] = useState<number | null>(null)
  const [commentDialog, setCommentDialog] = useState<{
    isOpen: boolean
    documentId: number | null
    comment: string
    type: string
  }>({
    isOpen: false,
    documentId: null,
    comment: '',
    type: 'general'
  })

  // Load user data and documents
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
    
    loadDocuments()
    loadStats()
  }, [searchTerm, filterStatus])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchTerm) params.search = searchTerm
      if (filterStatus !== 'all') params.status = filterStatus

      // Load all documents instead of just pending ones
      const response = await apiClient.getDocuments(params)
      
      if (response.success && response.data) {
        setDocuments(response.data)
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error('Error loading documents:', error)
      setDocuments([])
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await apiClient.getDepartmentStats()
      if (response.success && response.data) {
        setStats({
          approved_this_month: response.data.approved_this_month,
          rejected_this_month: response.data.rejected_this_month,
          pending_approval: response.data.pending_approval
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleApprove = async (documentId: number) => {
    setApproving(documentId)
    try {
      console.log('Approving document:', documentId)
      const response = await apiClient.reviewDocument(documentId, {
        status: 'approved',
        comment: 'Document approved by department head'
      })

      console.log('Approval response:', response)

      if (response.success) {
        toast.success('Document approved successfully')
        
        // Update local state instead of reloading
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === documentId 
              ? { ...doc, status: 'approved' }
              : doc
          )
        )
        
        loadStats() // Reload stats
      } else {
        toast.error(response.message || 'Failed to approve document')
      }
    } catch (error) {
      console.error('Error approving document:', error)
      toast.error('Failed to approve document')
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async (documentId: number) => {
    setRejecting(documentId)
    try {
      console.log('Rejecting document:', documentId)
      const response = await apiClient.reviewDocument(documentId, {
        status: 'rejected',
        comment: 'Document rejected by department head'
      })

      console.log('Rejection response:', response)

      if (response.success) {
        toast.success('Document rejected successfully')
        
        // Update local state instead of reloading
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === documentId 
              ? { ...doc, status: 'rejected' }
              : doc
          )
        )
        
        loadStats() // Reload stats
      } else {
        toast.error(response.message || 'Failed to reject document')
      }
    } catch (error) {
      console.error('Error rejecting document:', error)
      toast.error('Failed to reject document')
    } finally {
      setRejecting(null)
    }
  }

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePreview = async (documentId: number) => {
    try {
      await apiClient.previewDepartmentDocument(documentId)
      console.log('Document preview opened:', documentId)
    } catch (error) {
      console.error('Error previewing document:', error)
      toast.error('Failed to preview document')
    }
  }

  const handleDownload = async (documentId: number) => {
    try {
      await apiClient.downloadDepartmentDocument(documentId)
      console.log('Document download started:', documentId)
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Failed to download document')
    }
  }

  const openCommentDialog = (documentId: number) => {
    setCommentDialog({
      isOpen: true,
      documentId,
      comment: '',
      type: 'general'
    })
  }

  const closeCommentDialog = () => {
    setCommentDialog({
      isOpen: false,
      documentId: null,
      comment: '',
      type: 'general'
    })
  }

  const handleCommentSubmit = async () => {
    if (!commentDialog.documentId || !commentDialog.comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    try {
      const response = await apiClient.addDocumentComment(
        commentDialog.documentId,
        commentDialog.comment,
        commentDialog.type
      )

      if (response.success) {
        toast.success('Comment sent successfully')
        closeCommentDialog()
      } else {
        toast.error(response.message || 'Failed to send comment')
      }
    } catch (error) {
      console.error('Error sending comment:', error)
      toast.error('Failed to send comment')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Document Approvals"
        subtitle="Review and approve submissions"
        backUrl="/department/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Document Approvals</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Documents List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading documents...</p>
            </div>
          ) : documents.length > 0 ? (
            documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getPriorityColor(doc.priority)}>
                          {doc.priority} priority
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {doc.teacher}
                        </span>
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {doc.type}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {doc.submittedDate}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Author: {doc.author}</span>
                        <span className="mx-2">•</span>
                        <span>Category: {doc.category}</span>
                        <span className="mx-2">•</span>
                        <span>Year: {doc.year}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePreview(doc.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(doc.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        onClick={() => openCommentDialog(doc.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={() => handleApprove(doc.id)}
                        disabled={approving === doc.id}
                      >
                        {approving === doc.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => handleReject(doc.id)}
                        disabled={rejecting === doc.id}
                      >
                        {rejecting === doc.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search terms or filters.' 
                    : 'No documents are currently pending approval.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Approval Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.approved_this_month}</p>
              <p className="text-sm text-gray-600">Approved This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{stats.rejected_this_month}</p>
              <p className="text-sm text-gray-600">Rejected This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.pending_approval}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Comment Dialog */}
      <Dialog open={commentDialog.isOpen} onOpenChange={closeCommentDialog}>
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Send Comment to Teacher
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Send a comment to the teacher about this document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment Type
              </label>
              <Select 
                value={commentDialog.type} 
                onValueChange={(value) => setCommentDialog(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="general" className="text-gray-900">General</SelectItem>
                  <SelectItem value="approval" className="text-gray-900">Approval Note</SelectItem>
                  <SelectItem value="rejection" className="text-gray-900">Rejection Reason</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <Textarea
                value={commentDialog.comment}
                onChange={(e) => setCommentDialog(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Enter your comment here..."
                rows={4}
                className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {commentDialog.comment.length}/500 characters
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              onClick={closeCommentDialog}
              className="bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCommentSubmit}
              disabled={!commentDialog.comment.trim()}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              Send Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  )
}
