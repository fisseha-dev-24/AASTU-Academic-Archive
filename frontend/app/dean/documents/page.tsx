"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  Building2,
  ChevronRight,
  ChevronDown,
  UserCheck,
  FileCheck,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function DocumentsTree() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([])
  const [expandedYears, setExpandedYears] = useState<string[]>([])

  // Document tree structure by department and year
  const documentTree = [
    {
      department: "Computer Science",
      code: "CS",
      totalDocs: 1247,
      years: [
        {
          year: 2024,
          documents: [
            {
              id: 1,
              title: "Advanced Database Systems - Course Materials",
              teacher: "Dr. Sarah Johnson",
              type: "Course Material",
              approvedDate: "2024-01-15",
              downloads: 245,
              tags: ["database", "sql", "nosql"],
            },
            {
              id: 2,
              title: "Machine Learning Research Paper",
              teacher: "Prof. Michael Chen",
              type: "Research Paper",
              approvedDate: "2024-01-14",
              downloads: 189,
              tags: ["ml", "ai", "research"],
            },
            {
              id: 3,
              title: "Data Structures and Algorithms Lab Manual",
              teacher: "Dr. Sarah Johnson",
              type: "Lab Manual",
              approvedDate: "2024-01-10",
              downloads: 567,
              tags: ["algorithms", "data-structures", "lab"],
            },
          ],
        },
        {
          year: 2023,
          documents: [
            {
              id: 4,
              title: "Software Engineering Lab Manual",
              teacher: "Dr. Emily Davis",
              type: "Lab Manual",
              approvedDate: "2023-12-20",
              downloads: 567,
              tags: ["software-engineering", "lab", "project"],
            },
            {
              id: 5,
              title: "Computer Networks Final Exam",
              teacher: "Prof. Michael Chen",
              type: "Exam Paper",
              approvedDate: "2023-12-15",
              downloads: 234,
              tags: ["networks", "exam", "final"],
            },
          ],
        },
      ],
    },
    {
      department: "Electrical Engineering",
      code: "EE",
      totalDocs: 1456,
      years: [
        {
          year: 2024,
          documents: [
            {
              id: 6,
              title: "Circuit Analysis Fundamentals",
              teacher: "Prof. Ahmed Hassan",
              type: "Course Material",
              approvedDate: "2024-01-12",
              downloads: 345,
              tags: ["circuits", "analysis", "fundamentals"],
            },
            {
              id: 7,
              title: "Power Systems Lab Manual",
              teacher: "Dr. Lisa Wang",
              type: "Lab Manual",
              approvedDate: "2024-01-08",
              downloads: 278,
              tags: ["power-systems", "lab", "electrical"],
            },
          ],
        },
      ],
    },
    {
      department: "Mechanical Engineering",
      code: "ME",
      totalDocs: 1789,
      years: [
        {
          year: 2024,
          documents: [
            {
              id: 8,
              title: "Thermodynamics Course Materials",
              teacher: "Dr. Emily Davis",
              type: "Course Material",
              approvedDate: "2024-01-16",
              downloads: 456,
              tags: ["thermodynamics", "heat", "energy"],
            },
          ],
        },
      ],
    },
  ]

  const toggleDepartment = (deptName: string) => {
    setExpandedDepartments((prev) =>
      prev.includes(deptName) ? prev.filter((name) => name !== deptName) : [...prev, deptName],
    )
  }

  const toggleYear = (key: string) => {
    setExpandedYears((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Course Material":
        return "bg-blue-100 text-blue-800"
      case "Research Paper":
        return "bg-purple-100 text-purple-800"
      case "Lab Manual":
        return "bg-emerald-100 text-emerald-800"
      case "Exam Paper":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredDocuments = documentTree.filter((dept) =>
    dept.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dean/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documents Tree</h1>
                <p className="text-sm text-gray-600">College → Department → Year → Documents</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Documents Tree Structure</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course_material">Course Material</SelectItem>
                <SelectItem value="research_paper">Research Paper</SelectItem>
                <SelectItem value="lab_manual">Lab Manual</SelectItem>
                <SelectItem value="exam_paper">Exam Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tree Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              Hierarchical Document Structure
            </CardTitle>
            <CardDescription>Browse documents organized by department and academic year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((deptTree) => (
                <div key={deptTree.department} className="border rounded-lg p-4">
                  {/* Department Level */}
                  <button
                    onClick={() => toggleDepartment(deptTree.department)}
                    className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {expandedDepartments.includes(deptTree.department) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                      <Building2 className="h-6 w-6 text-blue-600" />
                      <div>
                        <span className="font-semibold text-gray-900 text-lg">{deptTree.department}</span>
                        <p className="text-sm text-gray-600">Department Code: {deptTree.code}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{deptTree.totalDocs} total documents</Badge>
                  </button>

                  {/* Year Level */}
                  {expandedDepartments.includes(deptTree.department) && (
                    <div className="mt-4 ml-8 space-y-3">
                      {deptTree.years.map((yearData) => {
                        const yearKey = `${deptTree.department}-${yearData.year}`
                        return (
                          <div key={yearData.year} className="border-l-2 border-blue-200 pl-4">
                            <button
                              onClick={() => toggleYear(yearKey)}
                              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                {expandedYears.includes(yearKey) ? (
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-500" />
                                )}
                                <Calendar className="h-5 w-5 text-emerald-600" />
                                <span className="font-medium text-gray-700">Academic Year {yearData.year}</span>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-800">
                                {yearData.documents.length} documents
                              </Badge>
                            </button>

                            {/* Documents Level */}
                            {expandedYears.includes(yearKey) && (
                              <div className="mt-3 ml-8 space-y-2">
                                {yearData.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-center space-x-4">
                                      <FileCheck className="h-5 w-5 text-green-600" />
                                      <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{doc.title}</h4>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                          <span className="flex items-center">
                                            <UserCheck className="h-3 w-3 mr-1" />
                                            Approved by {doc.teacher}
                                          </span>
                                          <Badge className={getTypeColor(doc.type)}>{doc.type}</Badge>
                                          <span>{doc.downloads} downloads</span>
                                          <span>Approved: {doc.approvedDate}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-2">
                                          {doc.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
