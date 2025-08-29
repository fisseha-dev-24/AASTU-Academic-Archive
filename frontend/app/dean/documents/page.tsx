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
} from "lucide-react"
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
  status: string
}

export default function DeanDocuments() {
  const [user, setUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])

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

    // Mock data for documents
    const mockDocuments: Document[] = [
      {
        id: 1,
        title: "Advanced Database Systems - Course Materials",
        author: "Dr. Sarah Johnson",
        department: "Computer Science",
        type: "Course Material",
        year: "2024",
        uploadDate: "2024-01-15",
        downloads: 245,
        views: 567,
        status: "approved"
      },
      {
        id: 2,
        title: "Machine Learning Research Paper",
        author: "Prof. Michael Chen",
        department: "Computer Science",
        type: "Research Paper",
        year: "2024",
        uploadDate: "2024-01-14",
        downloads: 189,
        views: 423,
        status: "approved"
      },
      {
        id: 3,
        title: "Circuit Design Manual",
        author: "Dr. Emily Davis",
        department: "Electrical Engineering",
        type: "Lab Manual",
        year: "2024",
        uploadDate: "2024-01-13",
        downloads: 156,
        views: 298,
        status: "pending"
      },
      {
        id: 4,
        title: "Software Architecture Principles",
        author: "Prof. Ahmed Hassan",
        department: "Software Engineering",
        type: "Course Material",
        year: "2024",
        uploadDate: "2024-01-12",
        downloads: 203,
        views: 445,
        status: "approved"
      },
      {
        id: 5,
        title: "Mechanical Design Project Guidelines",
        author: "Dr. Lisa Wang",
        department: "Mechanical Engineering",
        type: "Project Guidelines",
        year: "2024",
        uploadDate: "2024-01-11",
        downloads: 178,
        views: 312,
        status: "pending"
      }
    ]

    setDocuments(mockDocuments)
  }, [])

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus
    const matchesDepartment = filterDepartment === "all" || doc.department === filterDepartment
    return matchesSearch && matchesStatus && matchesDepartment
  })

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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Course Material":
        return <Badge className="bg-blue-100 text-blue-800">{type}</Badge>
      case "Research Paper":
        return <Badge className="bg-purple-100 text-purple-800">{type}</Badge>
      case "Lab Manual":
        return <Badge className="bg-emerald-100 text-emerald-800">{type}</Badge>
      case "Project Guidelines":
        return <Badge className="bg-orange-100 text-orange-800">{type}</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="College Documents"
        subtitle="Manage college-wide materials"
        backUrl="/dean/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Documents List */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              College Documents ({filteredDocuments.length})
            </CardTitle>
            <CardDescription>Browse and manage all college documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      {getStatusBadge(doc.status)}
                      {getTypeBadge(doc.type)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {doc.author}
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {doc.department}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {doc.year}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {doc.views} views
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {doc.downloads} downloads
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No documents found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
