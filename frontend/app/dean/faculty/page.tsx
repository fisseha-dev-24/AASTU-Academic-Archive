"use client"

"use client"

"use client"

"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Search,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
}

interface Faculty {
  id: number
  name: string
  email: string
  role: string
  department: string
  department_id: string
  position: string
  phone: string
  joinDate: string
  documentsUploaded: number
  status: string
  total_uploads: number
  approved_uploads: number
  approval_rate: number
  last_activity: string
}

export default function DeanFaculty() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    loadUserData()
    loadFacultyData()
    
    // Check for department filter from URL
    const deptId = searchParams.get('dept')
    if (deptId) {
      // Set the filter to the specific department
      // We'll need to get the department name from the faculty data
      setFilterDepartment(deptId)
    }
  }, [searchParams])

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

  const loadFacultyData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.getDeanFacultyManagement()
      
      if (response.success && response.data) {
        const formattedFaculty = response.data.map((member: any) => ({
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role,
          department: member.department,
          department_id: member.department_id || 'unknown', // Add department ID for filtering
          position: member.role === 'department_head' ? 'Department Head' : 'Teacher',
          phone: '+251 XXX XXX XXX', // Default phone since API doesn't provide it
          joinDate: member.created_at ? new Date(member.created_at).toLocaleDateString() : 'Unknown',
          documentsUploaded: member.total_uploads,
          status: member.approval_rate > 0 ? 'active' : 'inactive',
          total_uploads: member.total_uploads,
          approved_uploads: member.approved_uploads,
          approval_rate: member.approval_rate,
          last_activity: member.last_activity
        }))
        setFaculty(formattedFaculty)
        
        // Extract unique departments for filter dropdown
        const departmentSet = new Set<string>()
        const uniqueDepartments: {id: string, name: string}[] = []
        
        formattedFaculty.forEach((member: Faculty) => {
          if (member.department && member.department_id && !departmentSet.has(member.department)) {
            departmentSet.add(member.department)
            uniqueDepartments.push({id: member.department_id, name: member.department})
          }
        })
        
        setDepartments(uniqueDepartments)
      } else {
        setFaculty([])
        setError('No faculty data found')
      }
    } catch (error) {
      console.error('Error loading faculty data:', error)
      setError('Failed to load faculty data')
      toast.error('Failed to load faculty data')
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || member.department_id === filterDepartment
    
    return matchesSearch && matchesDepartment
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading faculty data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Faculty Management"
        subtitle="Manage and monitor faculty members across the college"
        backUrl="/dean/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Filter Faculty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Faculty List */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Faculty Members ({filteredFaculty.length})
              </div>
              {error && (
                <Badge variant="destructive" className="text-xs">
                  {error}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Faculty members and their performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaculty.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No faculty members found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFaculty.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg font-semibold">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-xs text-blue-600 font-medium">{member.position}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(member.status)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">{member.department}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">{member.total_uploads} documents</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">Joined: {member.joinDate}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                            <span className={`text-sm font-medium ${getPerformanceColor(member.approval_rate)}`}>
                              {member.approval_rate}% approval rate
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-gray-900">{member.total_uploads}</p>
                              <p className="text-gray-600">Total Uploads</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-green-600">{member.approved_uploads}</p>
                              <p className="text-gray-600">Approved</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-gray-900">{member.last_activity}</p>
                              <p className="text-gray-600">Last Activity</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-1" />
                          View Documents
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
