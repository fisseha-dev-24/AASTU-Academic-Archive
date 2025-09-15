"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download, Eye, Calendar, User, FileText, History, Clock, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface HistoryItem {
  id: number
  documentId: number
  title: string
  author: string
  department: string
  type: string
  action: "download" | "view" | "bookmark" | "share"
  timestamp: string
  description: string
  keywords: string[]
  status: string
}

export default function StudentHistory() {
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    loadUserData()
    loadHistory()
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

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get history from API
      const response = await apiClient.getHistory()
      if (response.success) {
        setHistory(response.data || [])
      } else {
        setError(response.message || 'Failed to load history')
        toast.error('Failed to load history')
      }
    } catch (error) {
      console.error('Error loading history:', error)
      setError('Failed to load history')
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (documentId: number) => {
    try {
      await apiClient.downloadDocument(documentId)
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Failed to download document')
    }
  }

  const handlePreview = async (documentId: number) => {
    try {
      await apiClient.previewDocument(documentId)
      toast.success('Document preview opened')
    } catch (error) {
      console.error('Error previewing document:', error)
      toast.error('Failed to preview document')
    }
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || item.action === actionFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    
    return matchesSearch && matchesAction && matchesType
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case 'download': return 'bg-blue-100 text-blue-800'
      case 'view': return 'bg-green-100 text-green-800'
      case 'bookmark': return 'bg-purple-100 text-purple-800'
      case 'share': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'download': return <Download className="w-4 h-4" />
      case 'view': return <Eye className="w-4 h-4" />
      case 'bookmark': return <FileText className="w-4 h-4" />
      case 'share': return <FileText className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading History</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadHistory} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <PageHeader
        title="My History"
        subtitle="Track your document interactions and activities"
        backUrl="/student/dashboard"
        user={user}
      />

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                    <SelectItem value="bookmark">Bookmark</SelectItem>
                    <SelectItem value="share">Share</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Lecture Notes">Lecture Notes</SelectItem>
                    <SelectItem value="Research Paper">Research Paper</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredHistory.length === 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="py-12 text-center">
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No history found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || actionFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "You haven't interacted with any documents yet"}
              </p>
              {!searchTerm && actionFilter === "all" && typeFilter === "all" && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse Documents
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow bg-white shadow-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <Badge className={getActionColor(item.action || 'unknown')}>
                          <span className="flex items-center gap-1">
                            {getActionIcon(item.action || 'unknown')}
                            {(item.action || 'unknown').charAt(0).toUpperCase() + (item.action || 'unknown').slice(1)}
                          </span>
                        </Badge>
                        <Badge className={getStatusColor(item.status || 'unknown')}>
                          {(item.status || 'unknown').charAt(0).toUpperCase() + (item.status || 'unknown').slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                          {item.type}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                          <User className="w-4 h-4" />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                          <FileText className="w-4 h-4" />
                          <span>{item.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(item.documentId)}
                        className="bg-white hover:bg-gray-50 border-gray-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(item.documentId)}
                        className="bg-white hover:bg-gray-50 border-gray-300"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
