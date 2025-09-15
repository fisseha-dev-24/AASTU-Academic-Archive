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
import { 
  Search, 
  Download, 
  Eye, 
  ArrowLeft, 
  Calendar, 
  User, 
  BookOpen, 
  SlidersHorizontal, 
  X, 
  Filter,
  FileText,
  GraduationCap,
  Building,
  Clock,
  Star,
  TrendingUp,
  RefreshCw,
  Bookmark,
  Share2,
  Info
} from "lucide-react"
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
  college?: string
  course?: string
  semester?: string
  academic_year?: string
  language?: string
  file_format?: string
  approval_status?: string
  rating?: number
  views?: number
}

interface FilterOptions {
  colleges: string[]
  departments: string[]
  documentTypes: string[]
  years: string[]
  semesters: string[]
  academicYears: string[]
  languages: string[]
  fileFormats: string[]
  authors: string[]
}

export default function BrowseArchive() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedCollege, setSelectedCollege] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedFileFormat, setSelectedFileFormat] = useState("all")
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date-desc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [minDownloads, setMinDownloads] = useState("")
  const [maxDownloads, setMaxDownloads] = useState("")
  const [minRating, setMinRating] = useState("")
  const [maxRating, setMaxRating] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [bookmarkedDocuments, setBookmarkedDocuments] = useState<number[]>([])
  const [bookmarkMap, setBookmarkMap] = useState<{[key: number]: number}>({}) // documentId -> bookmarkId
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    colleges: [],
    departments: [],
    documentTypes: [],
    years: [],
    semesters: [],
    academicYears: [],
    languages: [],
    fileFormats: [],
    authors: []
  })
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })

  // Load user data and documents from API
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info')
    const authToken = localStorage.getItem('auth_token')
    
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
    
    if (authToken) {
      loadDocuments()
      loadFilterOptions()
      loadBookmarks()
    } else {
      console.error('No auth token found - user not logged in')
      setLoading(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || selectedType !== "all" || selectedDepartment !== "all" || selectedYear !== "all") {
        loadDocuments()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedType, selectedDepartment, selectedCollege, selectedYear, selectedSemester, selectedAcademicYear, selectedLanguage, selectedFileFormat, selectedAuthor, selectedKeywords, sortBy, minDownloads, maxDownloads, minRating, maxRating])

  const loadFilterOptions = async () => {
    try {
      const response = await apiClient.getFilterOptions()
      if (response.success && response.data) {
        setFilterOptions(response.data)
      }
    } catch (error) {
      console.error('Error loading filter options:', error)
      // Set fallback filter options
      setFilterOptions({
        colleges: ["College of Engineering", "College of Science", "College of Technology"],
        departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"],
        documentTypes: ["Lecture Notes", "Textbook", "Exam", "Assignment", "Project Report", "Research Paper", "Lab Report", "Thesis"],
        years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
        semesters: ["Fall", "Spring", "Summer"],
        academicYears: ["2023-2024", "2022-2023", "2021-2022", "2020-2021"],
        languages: ["English", "Amharic", "French", "German"],
        fileFormats: ["PDF", "DOC", "DOCX", "PPT", "PPTX", "XLS", "XLSX"],
        authors: ["Dr. Smith", "Prof. Johnson", "Dr. Williams", "Prof. Brown"]
      })
    }
  }

  const loadBookmarks = async () => {
    try {
      const response = await apiClient.getBookmarks()
      if (response.success && response.data) {
        const bookmarkIds = response.data.map((bookmark: any) => bookmark.document_id || bookmark.id)
        const bookmarkMapData: {[key: number]: number} = {}
        
        response.data.forEach((bookmark: any) => {
          bookmarkMapData[bookmark.document_id] = bookmark.id
        })
        
        setBookmarkedDocuments(bookmarkIds)
        setBookmarkMap(bookmarkMapData)
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    }
  }

  const loadDocuments = async () => {
    setSearching(true)
    setError(null)
    try {
      const params: any = {
        search_query: searchQuery,
        document_type: selectedType,
        department: selectedDepartment,
        college: selectedCollege,
        year: selectedYear,
        semester: selectedSemester,
        academic_year: selectedAcademicYear,
        language: selectedLanguage,
        file_format: selectedFileFormat,
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

      if (minRating) {
        params.min_rating = parseFloat(minRating)
      }

      if (maxRating) {
        params.max_rating = parseFloat(maxRating)
      }

      const response = await apiClient.searchDocuments(params)
      
      if (response.success && response.data) {
        let documentsData = []
        let paginationData = {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        }
        
        if (Array.isArray(response.data)) {
          documentsData = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          documentsData = response.data.data
          paginationData = response.data.pagination || paginationData
        } else if (response.data.documents && Array.isArray(response.data.documents)) {
          documentsData = response.data.documents
        }
        
        setDocuments(documentsData)
        setPagination(paginationData)
        
        if (documentsData.length === 0) {
          toast.info('No documents found matching your criteria')
        }
      } else {
        setDocuments([])
        setError('No documents found')
      }
    } catch (error) {
      console.error('Error loading documents:', error)
      setDocuments([])
      setError('Failed to load documents. Please try again.')
      toast.error('Failed to load documents')
    } finally {
      setSearching(false)
      setLoading(false)
    }
  }

  const availableKeywords = Array.from(new Set(documents.flatMap((doc) => doc.keywords || []))).sort()

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]))
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedDepartment("all")
    setSelectedCollege("all")
    setSelectedYear("all")
    setSelectedSemester("all")
    setSelectedAcademicYear("all")
    setSelectedLanguage("all")
    setSelectedFileFormat("all")
    setSelectedAuthor("")
    setSelectedKeywords([])
    setMinDownloads("")
    setMaxDownloads("")
    setMinRating("")
    setMaxRating("")
  }

  const handleViewDocument = async (documentId: number) => {
    try {
      await apiClient.previewDocument(documentId)
      toast.success('Document preview opened')
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

  const handleBookmarkToggle = async (documentId: number) => {
    try {
      if (bookmarkedDocuments.includes(documentId)) {
        // Remove bookmark
        const bookmarkId = bookmarkMap[documentId]
        if (bookmarkId) {
          const response = await apiClient.removeBookmark(bookmarkId)
          if (response.success) {
            setBookmarkedDocuments(prev => prev.filter(id => id !== documentId))
            setBookmarkMap(prev => {
              const newMap = {...prev}
              delete newMap[documentId]
              return newMap
            })
            toast.success('Bookmark removed')
          } else {
            toast.error('Failed to remove bookmark')
          }
        }
      } else {
        // Add bookmark
        const response = await apiClient.addBookmark(documentId)
        if (response.success) {
          setBookmarkedDocuments(prev => [...prev, documentId])
          // Reload bookmarks to get the new bookmark ID
          loadBookmarks()
          toast.success('Document bookmarked')
        } else {
          toast.error('Failed to bookmark document')
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast.error('Failed to update bookmark')
    }
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lecture notes':
        return 'bg-blue-100 text-blue-800'
      case 'textbook':
        return 'bg-green-100 text-green-800'
      case 'exam':
        return 'bg-red-100 text-red-800'
      case 'assignment':
        return 'bg-yellow-100 text-yellow-800'
      case 'project report':
        return 'bg-purple-100 text-purple-800'
      case 'research paper':
        return 'bg-indigo-100 text-indigo-800'
      case 'lab report':
        return 'bg-pink-100 text-pink-800'
      case 'thesis':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PageHeader
        title="Browse Archive"
        subtitle="Search and explore AASTU document archive"
        backUrl="/student/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-gray-900">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Advanced Search
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Find documents by title, author, keywords, or content with comprehensive filtering
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Search */}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents, authors, keywords, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
                <Button 
                  onClick={loadDocuments}
                  disabled={searching}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {searching ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {searching ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="College" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {filterOptions.colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {filterOptions.departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {filterOptions.documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {filterOptions.years.map((year) => (
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
                  <Separator className="bg-gray-200" />
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Semesters</SelectItem>
                          {filterOptions.semesters.map((semester) => (
                            <SelectItem key={semester} value={semester}>
                              {semester}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Academic Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Academic Years</SelectItem>
                          {filterOptions.academicYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Languages</SelectItem>
                          {filterOptions.languages.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedFileFormat} onValueChange={setSelectedFileFormat}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="File Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Formats</SelectItem>
                          {filterOptions.fileFormats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Author Filter */}
                    <div>
                      <Label htmlFor="author-filter" className="text-sm font-medium mb-2 block text-gray-700">
                        Author Name
                      </Label>
                      <Input
                        id="author-filter"
                        placeholder="Search by author name..."
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>

                    {/* Download and Rating Range Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">Download Range</Label>
                        <div className="flex space-x-2 items-center">
                          <Input
                            placeholder="Min"
                            type="number"
                            value={minDownloads}
                            onChange={(e) => setMinDownloads(e.target.value)}
                            className="w-24 border-2 border-gray-200 focus:border-blue-500"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            placeholder="Max"
                            type="number"
                            value={maxDownloads}
                            onChange={(e) => setMaxDownloads(e.target.value)}
                            className="w-24 border-2 border-gray-200 focus:border-blue-500"
                          />
                          <span className="text-sm text-gray-500">downloads</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-700">Rating Range</Label>
                        <div className="flex space-x-2 items-center">
                          <Input
                            placeholder="Min"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            className="w-24 border-2 border-gray-200 focus:border-blue-500"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            placeholder="Max"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={maxRating}
                            onChange={(e) => setMaxRating(e.target.value)}
                            className="w-24 border-2 border-gray-200 focus:border-blue-500"
                          />
                          <span className="text-sm text-gray-500">stars</span>
                        </div>
                      </div>
                    </div>

                    {/* Keywords Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-700">Keywords</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {availableKeywords.map((keyword) => (
                          <div key={keyword} className="flex items-center space-x-2">
                            <Checkbox
                              id={`keyword-${keyword}`}
                              checked={selectedKeywords.includes(keyword)}
                              onCheckedChange={() => handleKeywordToggle(keyword)}
                              className="border-gray-300"
                            />
                            <Label htmlFor={`keyword-${keyword}`} className="text-sm cursor-pointer text-gray-700">
                              {keyword}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={clearAllFilters} className="border-gray-300 text-gray-700">
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Active Filters Display */}
              {(selectedKeywords.length > 0 || selectedAuthor || minDownloads || maxDownloads || minRating || maxRating) && (
                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">Active filters:</span>
                  {selectedKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={() => handleKeywordToggle(keyword)}
                    >
                      {keyword} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {selectedAuthor && (
                    <Badge variant="secondary" className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200" onClick={() => setSelectedAuthor("")}>
                      Author: {selectedAuthor} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {(minDownloads || maxDownloads) && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={() => {
                        setMinDownloads("")
                        setMaxDownloads("")
                      }}
                    >
                      Downloads: {minDownloads || "0"}-{maxDownloads || "∞"} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {(minRating || maxRating) && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={() => {
                        setMinRating("")
                        setMaxRating("")
                      }}
                    >
                      Rating: {minRating || "0"}-{maxRating || "5"} <X className="h-3 w-3 ml-1" />
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
              <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-blue-500">
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
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                <SelectItem value="views-desc">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-4">{doc.title}</h3>
                          <div className="flex items-center space-x-2">
                            {doc.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600">{doc.rating.toFixed(1)}</span>
                              </div>
                            )}
                            {doc.approval_status && (
                              <Badge className={getStatusColor(doc.approval_status)}>
                                {doc.approval_status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{doc.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="truncate">{doc.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-green-500" />
                            <span className="truncate">{doc.department}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                            <span>{doc.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-2 text-orange-500" />
                            <span>{doc.downloads} downloads</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Badge className={getDocumentTypeColor(doc.type)}>
                            {doc.type}
                          </Badge>
                          {doc.keywords && Array.isArray(doc.keywords) && doc.keywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                              {keyword}
                            </Badge>
                          ))}
                          {doc.keywords && Array.isArray(doc.keywords) && doc.keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                              +{doc.keywords.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Additional metadata */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {doc.fileSize && (
                            <span>Size: {doc.fileSize}</span>
                          )}
                          {doc.pages && (
                            <span>Pages: {doc.pages}</span>
                          )}
                          {doc.views && (
                            <span>Views: {doc.views}</span>
                          )}
                          {doc.file_format && (
                            <span>Format: {doc.file_format}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <Button 
                          size="sm" 
                          onClick={() => handleViewDocument(doc.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDownloadDocument(doc.id)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleBookmarkToggle(doc.id)}
                          className={`${
                            bookmarkedDocuments.includes(doc.id) 
                              ? 'text-blue-600 hover:text-blue-700 bg-blue-50' 
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${bookmarkedDocuments.includes(doc.id) ? 'fill-current' : ''}`} />
                          {bookmarkedDocuments.includes(doc.id) ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && documents.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={clearAllFilters} className="border-gray-300 text-gray-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
