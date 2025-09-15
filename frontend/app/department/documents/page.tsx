"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download, Eye, Calendar, User, FileText, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, Users, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
}

interface Document {
  id: number
  title: string
  author: string
  department: string
  type: string
  year: string
  uploadDate: string
  downloads: number
  views: number
  status: "pending" | "approved" | "rejected"
  description: string
  keywords: string[]
  fileSize: string
  category: string
  teacher?: string
  submittedDate?: string
}

export default function DepartmentDocuments() {
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [commentDialog, setCommentDialog] = useState<{ open: boolean; documentId: number | null; comment: string; type: string }>({
    open: false,
    documentId: null,
    comment: "",
    type: "general"
  })

  useEffect(() => {
    loadUserData()
    loadDocuments()
  }, [])

  // Trigger search when search term or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDocuments()
    }, 300) // Debounce search by 300ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, typeFilter])

  const loadUserData = () => {
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
  }

  const loadDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get documents with search and filter parameters
      const params: any = {}
      if (searchTerm) params.search = searchTerm
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter
      if (typeFilter && typeFilter !== 'all') params.type = typeFilter
      
      const response = await apiClient.getDocuments(params)
      if (response.success) {
        setDocuments(response.data || [])
      } else {
        setError(response.message || 'Failed to load documents')
        toast.error('Failed to load documents')
      }
    } catch (error) {
      console.error('Error loading documents:', error)
      setError('Failed to load documents')
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (documentId: number, newStatus: string) => {
    try {
      const response = await apiClient.updateDocumentStatus(documentId, newStatus)
      if (response.success) {
        toast.success(`Document ${newStatus} successfully`)
        loadDocuments() // Reload documents
      } else {
        toast.error(response.message || 'Failed to update document status')
      }
    } catch (error) {
      console.error('Error updating document status:', error)
      toast.error('Failed to update document status')
    }
  }

  const handleDelete = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    try {
      const response = await apiClient.deleteDepartmentDocument(documentId)
      if (response.success) {
        toast.success('Document deleted successfully')
        loadDocuments() // Reload documents
      } else {
        toast.error(response.message || 'Failed to delete document')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document')
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

  // No client-side filtering needed - server handles it
  const filteredDocuments = documents

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
  }

  const openCommentDialog = (documentId: number) => {
    setCommentDialog({
      open: true,
      documentId,
      comment: "",
      type: "general"
    })
  }

  const closeCommentDialog = () => {
    setCommentDialog({
      open: false,
      documentId: null,
      comment: "",
      type: "general"
    })
  }

  const handleCommentSubmit = async () => {
    if (!commentDialog.documentId || !commentDialog.comment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    try {
      const response = await apiClient.addDocumentComment(
        commentDialog.documentId,
        commentDialog.comment,
        commentDialog.type
      )
      
      if (response.success) {
        toast.success("Comment sent to teacher successfully")
        closeCommentDialog()
      } else {
        toast.error(response.message || "Failed to send comment")
      }
    } catch (error) {
      console.error('Error sending comment:', error)
      toast.error("Failed to send comment")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Documents</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDocuments} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Document Approvals"
        subtitle="Review and approve documents submitted by teachers"
        backUrl="/department/dashboard"
        user={user}
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Department Document Approvals</h1>
              <p className="text-gray-600 mt-1">Review and approve documents submitted by teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Lecture Notes">Lecture Notes</SelectItem>
                    <SelectItem value="Research Paper">Research Paper</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "There are no documents in your department yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{doc.title}</h3>
                        <Badge className={getStatusColor(doc.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(doc.status)}
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {doc.teacher || 'Unknown'}
                        </span>
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {doc.type || 'Unknown'}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {doc.submittedDate || doc.uploadDate || 'Unknown'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Author: {doc.author || 'Unknown'}</span>
                        <span className="mx-2">•</span>
                        <span>Category: {doc.category || 'Unknown'}</span>
                        <span className="mx-2">•</span>
                        <span>Year: {doc.year || 'Unknown'}</span>
                      </div>
                      {doc.description && (
                        <p className="mt-2 text-sm text-gray-600">{doc.description}</p>
                      )}
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mt-2">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-blue-500" />
                          <span className="font-medium">{doc.views || 0}</span>
                          <span className="ml-1">views</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1 text-green-500" />
                          <span className="font-medium">{doc.downloads || 0}</span>
                          <span className="ml-1">downloads</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-purple-500" />
                          <span>Last updated {doc.submittedDate || doc.uploadDate || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {doc.keywords && doc.keywords.length > 0 ? (
                          doc.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No keywords</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {doc.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(doc.id, 'approved')}
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(doc.id, 'rejected')}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(doc.id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(doc.id)}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCommentDialog(doc.id)}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Comment Dialog */}
      <Dialog open={commentDialog.open} onOpenChange={closeCommentDialog}>
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Send Comment to Teacher
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Send a comment to the teacher who uploaded this document.
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
                  <SelectValue placeholder="Select comment type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="general" className="text-gray-900">General Comment</SelectItem>
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
                placeholder="Enter your comment here..."
                value={commentDialog.comment}
                onChange={(e) => setCommentDialog(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                maxLength={1000}
                className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {commentDialog.comment.length}/1000 characters
              </p>
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
