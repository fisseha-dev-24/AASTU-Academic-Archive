"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Building2,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react"
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
  status: string
  description?: string
  keywords?: string[]
}

export default function DeanDocuments() {
  const [user, setUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
    loadDocuments()
  }, [])

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
      const params: any = {}
      
      if (searchTerm) {
        params.query = searchTerm
      }
      
      if (filterDepartment !== "all") {
        params.document_type = filterDepartment
      }
      
      if (filterStatus !== "all") {
        params.status = filterStatus
      }

      const response = await apiClient.getDeanDocuments(params)

      if (response.success && response.data) {
        const formattedDocuments = response.data.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          author: doc.author,
          department: doc.department,
          type: doc.type,
          year: doc.year,
          uploadDate: doc.date,
          downloads: doc.downloads || 0,
          views: 0, // Will be updated when we have view tracking
          status: doc.status || 'approved',
          description: doc.description,
          keywords: doc.keywords
        }))
        setDocuments(formattedDocuments)
      } else {
        setDocuments([])
        setError('No documents found')
      }
    } catch (error) {
      console.error('Error loading documents:', error)
      setError('Failed to load documents')
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadDocuments()
  }

  const handleViewDocument = async (documentId: number) => {
    try {
      await apiClient.previewDocument(documentId)
      console.log('Document preview opened:', documentId)
    } catch (error) {
      console.error('Error previewing document:', error)
      toast.error('Failed to preview document')
    }
  }

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await apiClient.downloadDocument(documentId)
      console.log('Document download started:', documentId)
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Failed to download document')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus
    const matchesDepartment = filterDepartment === "all" || doc.department === filterDepartment
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="College Documents"
        subtitle="Manage and monitor all college documents"
        backUrl="/dean/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Filter Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by title, author, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents ({filteredDocuments.length})
              </div>
              {error && (
                <Badge variant="destructive" className="text-xs">
                  {error}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              All documents across the college with their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No documents found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                          {getStatusBadge(doc.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>{doc.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span>{doc.department}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>{doc.type}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{doc.uploadDate}</span>
                          </div>
                        </div>
                        {doc.description && (
                          <p className="text-gray-600 mb-4">{doc.description}</p>
                        )}
                        {doc.keywords && doc.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {doc.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Downloads: {doc.downloads}</span>
                          <span>Views: {doc.views}</span>
                          <span>Year: {doc.year}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          onClick={() => handleViewDocument(doc.id)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleDownloadDocument(doc.id)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
