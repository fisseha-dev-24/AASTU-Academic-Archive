"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Search,
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2,
  Plus,
  Settings,
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

interface Department {
  id: number
  name: string
  code: string
  description: string
  teacher_count: number
  student_count: number
  total_documents: number
  pending_documents: number
  approved_documents: number
  approval_rate: number
  is_active: boolean
}

export default function DeanDepartments() {
  const [user, setUser] = useState<User | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadUserData()
    loadDepartments()
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

  const loadDepartments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.getDeanDepartmentAnalytics()
      
      if (response.success && response.data) {
        // Transform the data to match our interface
        const transformedDepartments = response.data.map((dept: any) => ({
          id: dept.id,
          name: dept.name,
          code: dept.code || dept.name.substring(0, 3).toUpperCase(),
          description: dept.description || `${dept.name} Department`,
          teacher_count: dept.teacher_count,
          student_count: dept.student_count,
          total_documents: dept.total_documents,
          pending_documents: dept.pending_documents,
          approved_documents: dept.approved_documents,
          approval_rate: dept.approval_rate,
          is_active: true // Default to active since we don't have this field
        }))
        setDepartments(transformedDepartments)
      } else {
        setError('Failed to load departments data')
        toast.error('Failed to load departments data')
      }
    } catch (error) {
      console.error('Error loading departments:', error)
      setError('Failed to load departments data')
      toast.error('Failed to load departments data')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getApprovalRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getApprovalRateBg = (rate: number) => {
    if (rate >= 90) return 'bg-green-100'
    if (rate >= 80) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    )
  }

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading departments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Department Management"
        subtitle="Monitor and manage all college departments"
        backUrl="/dean/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 mt-2">
              {filteredDepartments.length} departments across the college
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // TODO: Implement add department modal/form
                toast.info('Add Department functionality coming soon')
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // TODO: Implement settings modal
                toast.info('Settings functionality coming soon')
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search departments by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Departments Grid */}
        {error ? (
          <Card className="shadow-lg border-0 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="text-center">
                <Building2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredDepartments.length === 0 ? (
          <Card className="shadow-lg border-0 bg-gray-50 border-gray-200">
            <CardContent className="p-12">
              <div className="text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No departments found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <Card key={dept.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 bg-blue-100">
                        <AvatarFallback className="text-blue-600 font-semibold">
                          {getInitials(dept.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <p className="text-sm text-gray-500 font-mono">{dept.code}</p>
                      </div>
                    </div>
                    {getStatusBadge(dept.is_active)}
                  </div>
                  <CardDescription className="pt-2">
                    {dept.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{dept.teacher_count}</div>
                      <div className="text-xs text-blue-600">Faculty</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{dept.student_count}</div>
                      <div className="text-xs text-green-600">Students</div>
                    </div>
                  </div>

                  {/* Document Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Total Documents:</span>
                      <span className="font-semibold text-gray-900">{dept.total_documents}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Pending:</span>
                      <span className="font-semibold text-yellow-600">{dept.pending_documents}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Approved:</span>
                      <span className="font-semibold text-green-600">{dept.approved_documents}</span>
                    </div>
                  </div>

                  {/* Approval Rate */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Approval Rate:</span>
                      <Badge className={`${getApprovalRateBg(dept.approval_rate)} ${getApprovalRateColor(dept.approval_rate)}`}>
                        {dept.approval_rate}%
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `/dean/faculty?dept=${dept.id}`}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Faculty
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `/dean/documents?dept=${dept.id}`}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredDepartments.length > 0 && (
          <div className="mt-12">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>College Overview</span>
                </CardTitle>
                <CardDescription>Summary statistics across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {filteredDepartments.reduce((sum, dept) => sum + dept.teacher_count, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Faculty</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {filteredDepartments.reduce((sum, dept) => sum + dept.student_count, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {filteredDepartments.reduce((sum, dept) => sum + dept.total_documents, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Documents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {Math.round(
                        filteredDepartments.reduce((sum, dept) => sum + dept.approval_rate, 0) / 
                        filteredDepartments.length
                      )}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Approval Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
