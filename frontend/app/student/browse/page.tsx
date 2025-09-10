"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Search, Download, Eye, ArrowLeft, Calendar, User, BookOpen, SlidersHorizontal, X } from "lucide-react"
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
  author: string
  department: string
  type: string
  date: string
  year: string
  downloads: number
  description: string
  keywords: string[]
  fileSize: string
  pages: number
}

export default function BrowseArchive() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date-desc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [minDownloads, setMinDownloads] = useState("")
  const [maxDownloads, setMaxDownloads] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })

  // Load user data and documents from API
  useEffect(() => {
    // Load user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    const authToken = localStorage.getItem('auth_token')
    
    console.log('Browse page - User info:', userInfo)
    console.log('Browse page - Auth token:', authToken ? 'Present' : 'Missing')
    
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
        console.log('Browse page - User data:', userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
    
    if (authToken) {
      loadDocuments()
    } else {
      console.error('No auth token found - user not logged in')
      setLoading(false)
    }
  }, [searchQuery, selectedType, selectedDepartment, selectedYear, selectedAuthor, selectedKeywords, sortBy, minDownloads, maxDownloads])

  const loadDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        search_query: searchQuery,
        document_type: selectedType,
        department: selectedDepartment,
        year: selectedYear,
        author: selectedAuthor,
        sort_by: sortBy,
      }

      if (selectedKeywords.length > 0) {
        params.keywords = selectedKeywords
      }

      if (minDownloads) {
        params.min_downloads = parseInt(minDownloads)
      }

      if (maxDownloads) {
        params.max_downloads = parseInt(maxDownloads)
      }

      console.log('Loading documents with params:', params)
      const response = await apiClient.searchDocuments(params)
      console.log('API response:', response)
      
      if (response.success && response.data) {
        console.log('Documents data:', response.data)
        
        // Handle different response formats
        let documentsData = []
        let paginationData = {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        }
        
        if (Array.isArray(response.data)) {
          // Direct array response
          documentsData = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Paginated response
          documentsData = response.data.data
          paginationData = response.data.pagination || paginationData
        } else if (response.data.documents && Array.isArray(response.data.documents)) {
          // Alternative format
          documentsData = response.data.documents
        }
        
        console.log('Processed documents data:', documentsData)
        console.log('Pagination data:', paginationData)
        
        setDocuments(documentsData)
        setPagination(paginationData)
        
        if (documentsData.length === 0) {
          toast.info('No documents found matching your criteria')
        }
      } else {
        console.log('No documents found or API error:', response)
        setDocuments([])
        setError('No documents found')
      }
    } catch (error) {
      console.error('Error loading documents:', error)
      setDocuments([])
      setError('Failed to load documents. Please try again.')
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const availableKeywords = Array.from(new Set(documents.flatMap((doc) => doc.keywords))).sort()

  const availableYears = Array.from(new Set(documents.map((doc) => doc.year)))
    .sort()
    .reverse()

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]))
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedDepartment("all")
    setSelectedYear("all")
    setSelectedAuthor("")
    setSelectedKeywords([])
    setMinDownloads("")
    setMaxDownloads("")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <PageHeader
        title="Browse Archive"
        subtitle="Search and explore AASTU Digital Repository"
        backUrl="/student/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-gray-800">
                  <Search className="h-5 w-5 mr-2 text-gray-600" />
                  Advanced Search
                </CardTitle>
                <CardDescription className="text-gray-700">Find documents by title, author, keywords, or content</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="border-amber-200 text-amber-800 hover:bg-amber-50 hover:border-amber-300 rounded-xl">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Search */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search documents, authors, keywords, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Button onClick={loadDocuments} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="rounded-xl border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="thesis">Thesis</SelectItem>
                    <SelectItem value="project-report">Project Report</SelectItem>
                    <SelectItem value="research-paper">Research Paper</SelectItem>
                    <SelectItem value="lab-report">Lab Report</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="rounded-xl border-amber-200 focus:border-amber-400">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                    <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="chemical-engineering">Chemical Engineering</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="rounded-xl border-slate-200 focus:border-slate-400">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <>
                  <Separator />
                  <div className="space-y-6">
                    {/* Author Filter */}
                    <div>
                      <Label htmlFor="author-filter" className="text-sm font-medium mb-2 block">
                        Author Name
                      </Label>
                      <Input
                        id="author-filter"
                        placeholder="Search by author name..."
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                      />
                    </div>

                    {/* Download Range Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Download Range</Label>
                      <div className="flex space-x-2 items-center">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={minDownloads}
                          onChange={(e) => setMinDownloads(e.target.value)}
                          className="w-24"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          placeholder="Max"
                          type="number"
                          value={maxDownloads}
                          onChange={(e) => setMaxDownloads(e.target.value)}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-500">downloads</span>
                      </div>
                    </div>

                    {/* Keywords Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Keywords</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                        {availableKeywords.map((keyword) => (
                          <div key={keyword} className="flex items-center space-x-2">
                            <Checkbox
                              id={`keyword-${keyword}`}
                              checked={selectedKeywords.includes(keyword)}
                              onCheckedChange={() => handleKeywordToggle(keyword)}
                            />
                            <Label htmlFor={`keyword-${keyword}`} className="text-sm cursor-pointer">
                              {keyword}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={clearAllFilters} className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl">
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Active Filters Display */}
              {(selectedKeywords.length > 0 || selectedAuthor || minDownloads || maxDownloads) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  {selectedKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleKeywordToggle(keyword)}
                    >
                      {keyword} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {selectedAuthor && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedAuthor("")}>
                      Author: {selectedAuthor} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {(minDownloads || maxDownloads) && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        setMinDownloads("")
                        setMaxDownloads("")
                      }}
                    >
                      Downloads: {minDownloads || "0"}-{maxDownloads || "∞"} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? "Loading..." : `${pagination.total} document${pagination.total !== 1 ? "s" : ""} found`}
            </h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="downloads-desc">Most Downloaded</SelectItem>
                <SelectItem value="downloads-asc">Least Downloaded</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
                <SelectItem value="author-asc">Author A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading documents...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-all duration-300 shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                        <p className="text-gray-600 mb-3">{doc.description}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-blue-600" />
                            {doc.author}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1 text-amber-600" />
                            {doc.department}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-slate-600" />
                            {doc.date}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1 text-blue-600" />
                            {doc.downloads} downloads
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">{doc.type}</Badge>
                          {doc.keywords.slice(0, 4).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-amber-200 text-amber-700">
                              {keyword}
                            </Badge>
                          ))}
                          {doc.keywords.length > 4 && (
                            <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">
                              +{doc.keywords.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <Button size="sm" onClick={() => handleViewDocument(doc.id)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc.id)} className="border-amber-200 text-amber-800 hover:bg-amber-50 hover:border-amber-300 rounded-xl">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && documents.length === 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
