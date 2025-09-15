"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Bookmark, 
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  Star,
  Clock
} from "lucide-react"
import { apiClient } from "@/lib/api"
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
  description: string
  type: string
  department: string
  uploaded_by: string
  uploaded_at: string
  downloads: number
  views: number
  file_size: string
  tags: string[]
  is_bookmarked: boolean
  rating: number
}

export default function MyDocumentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

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
    
    loadMyDocuments()
  }, [])

  const loadMyDocuments = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getMyDocuments()
      
      if (response.success && response.data) {
        setDocuments(response.data)
      }
    } catch (error) {
      console.error('Error loading my documents:', error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDocument = async (documentId: number) => {
    try {
      await apiClient.previewDocument(documentId)
      toast.success('Document opened for preview')
    } catch (error) {
      console.error('Error previewing document:', error)
      toast.error('Failed to preview document')
    }
  }

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await apiClient.downloadDocument(documentId)
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Failed to download document')
    }
  }

  const handleBookmarkToggle = async (documentId: number, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await apiClient.removeBookmark(documentId)
        toast.success('Bookmark removed')
      } else {
        await apiClient.addBookmark(documentId)
        toast.success('Bookmark added')
      }
      // Reload documents to update bookmark status
      loadMyDocuments()
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast.error('Failed to update bookmark')
    }
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'Lecture Notes':
        return 'bg-blue-100 text-blue-800'
      case 'Textbook':
        return 'bg-green-100 text-green-800'
      case 'Exam':
        return 'bg-red-100 text-red-800'
      case 'Assignment':
        return 'bg-yellow-100 text-yellow-800'
      case 'Research Paper':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterType === "all" || doc.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const documentTypes = [...new Set(documents.map(doc => doc.type))]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">Manage and organize your academic documents</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search documents, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your documents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {doc.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmarkToggle(doc.id, doc.is_bookmarked)}
                      className="ml-2 p-2"
                    >
                      <Bookmark 
                        className={`h-4 w-4 ${doc.is_bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                      />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Document Type and Rating */}
                    <div className="flex items-center justify-between">
                      <Badge className={getDocumentTypeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{doc.rating}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{doc.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Document Info */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="truncate">{doc.uploaded_by}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{doc.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          <span>{doc.downloads} downloads</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(doc.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.id)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== "all" ? "No documents found" : "No documents yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Start browsing and bookmarking documents to see them here."
                }
              </p>
              {!searchTerm && filterType === "all" && (
                <Button onClick={() => window.location.href = '/student/browse'}>
                  Browse Documents
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

