"use client"

import { useState } from "react"
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

export default function BrowseArchive() {
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

  // Mock data - in real app this would come from API
  const documents = [
    {
      id: 1,
      title: "Machine Learning Applications in Healthcare",
      author: "Sarah Johnson",
      department: "Computer Science",
      type: "Thesis",
      date: "2024-01-15",
      year: "2024",
      downloads: 45,
      description:
        "A comprehensive study on applying machine learning algorithms to healthcare diagnostics and patient care optimization...",
      keywords: ["machine learning", "healthcare", "AI", "diagnostics", "neural networks"],
      fileSize: "2.4 MB",
      pages: 120,
    },
    {
      id: 2,
      title: "Sustainable Energy Systems Design",
      author: "Michael Chen",
      department: "Electrical Engineering",
      type: "Project Report",
      date: "2024-01-12",
      year: "2024",
      downloads: 32,
      description:
        "Design and implementation of renewable energy systems for rural communities with focus on solar and wind integration...",
      keywords: ["renewable energy", "sustainability", "solar power", "design", "wind energy"],
      fileSize: "1.8 MB",
      pages: 85,
    },
    {
      id: 3,
      title: "Advanced Database Optimization Techniques",
      author: "Emily Davis",
      department: "Computer Science",
      type: "Research Paper",
      date: "2024-01-10",
      year: "2024",
      downloads: 28,
      description: "Novel approaches to database query optimization and performance tuning...",
      keywords: ["database", "optimization", "performance", "SQL"],
      fileSize: "1.5 MB",
      pages: 90,
    },
    {
      id: 4,
      title: "Structural Analysis of High-Rise Buildings",
      author: "David Wilson",
      department: "Civil Engineering",
      type: "Thesis",
      date: "2024-01-08",
      year: "2024",
      downloads: 19,
      description: "Comprehensive structural analysis methods for modern high-rise construction...",
      keywords: ["structural engineering", "buildings", "analysis", "construction"],
      fileSize: "2.0 MB",
      pages: 110,
    },
    {
      id: 5,
      title: "Wireless Communication Protocols",
      author: "Lisa Anderson",
      department: "Electrical Engineering",
      type: "Lab Report",
      date: "2024-01-05",
      year: "2024",
      downloads: 15,
      description: "Implementation and testing of various wireless communication protocols...",
      keywords: ["wireless", "communication", "protocols", "networking"],
      fileSize: "1.2 MB",
      pages: 75,
    },
  ]

  const availableKeywords = Array.from(new Set(documents.flatMap((doc) => doc.keywords))).sort()

  const availableYears = Array.from(new Set(documents.map((doc) => doc.year)))
    .sort()
    .reverse()

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType === "all" || doc.type.toLowerCase().replace(" ", "-") === selectedType
    const matchesDepartment =
      selectedDepartment === "all" || doc.department.toLowerCase().replace(" ", "-") === selectedDepartment
    const matchesYear = selectedYear === "all" || doc.year === selectedYear
    const matchesAuthor = !selectedAuthor || doc.author.toLowerCase().includes(selectedAuthor.toLowerCase())
    const matchesKeywords =
      selectedKeywords.length === 0 || selectedKeywords.some((keyword) => doc.keywords.includes(keyword))

    const matchesDownloadRange =
      (!minDownloads || doc.downloads >= Number.parseInt(minDownloads)) &&
      (!maxDownloads || doc.downloads <= Number.parseInt(maxDownloads))

    return (
      matchesSearch &&
      matchesType &&
      matchesDepartment &&
      matchesYear &&
      matchesAuthor &&
      matchesKeywords &&
      matchesDownloadRange
    )
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "downloads-desc":
        return b.downloads - a.downloads
      case "downloads-asc":
        return a.downloads - b.downloads
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "author-asc":
        return a.author.localeCompare(b.author)
      default:
        return 0
    }
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/student/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Browse Archive</h1>
              <p className="text-sm text-gray-500">Search and explore AASTU document archive</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Advanced Search
                </CardTitle>
                <CardDescription>Find documents by title, author, keywords, or content</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
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
                  />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                      <Button variant="outline" size="sm" onClick={clearAllFilters}>
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
              {sortedDocuments.length} document{sortedDocuments.length !== 1 ? "s" : ""} found
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

          <div className="grid gap-6">
            {sortedDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-gray-600 mb-3">{doc.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {doc.author}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {doc.department}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {doc.date}
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {doc.downloads} downloads
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <Badge variant="secondary">{doc.type}</Badge>
                        {doc.keywords.slice(0, 4).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {doc.keywords.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{doc.keywords.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedDocuments.length === 0 && (
            <Card>
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
    </div>
  )
}
