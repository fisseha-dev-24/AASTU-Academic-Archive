"use client"

import { useState, useEffect } from "react"
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

interface Faculty {
  id: number
  name: string
  email: string
  department: string
  position: string
  phone: string
  joinDate: string
  documentsUploaded: number
  status: string
}

export default function DeanFaculty() {
  const [user, setUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [faculty, setFaculty] = useState<Faculty[]>([])

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

    // Mock data for faculty
    const mockFaculty: Faculty[] = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@aastu.edu.et",
        department: "Computer Science",
        position: "Associate Professor",
        phone: "+251 911 123 456",
        joinDate: "2020-03-15",
        documentsUploaded: 45,
        status: "active"
      },
      {
        id: 2,
        name: "Prof. Michael Chen",
        email: "michael.chen@aastu.edu.et",
        department: "Computer Science",
        position: "Professor",
        phone: "+251 922 234 567",
        joinDate: "2018-09-01",
        documentsUploaded: 67,
        status: "active"
      },
      {
        id: 3,
        name: "Dr. Emily Davis",
        email: "emily.davis@aastu.edu.et",
        department: "Electrical Engineering",
        position: "Assistant Professor",
        phone: "+251 933 345 678",
        joinDate: "2021-01-10",
        documentsUploaded: 23,
        status: "active"
      },
      {
        id: 4,
        name: "Prof. Ahmed Hassan",
        email: "ahmed.hassan@aastu.edu.et",
        department: "Software Engineering",
        position: "Professor",
        phone: "+251 944 456 789",
        joinDate: "2017-06-20",
        documentsUploaded: 89,
        status: "active"
      },
      {
        id: 5,
        name: "Dr. Lisa Wang",
        email: "lisa.wang@aastu.edu.et",
        department: "Mechanical Engineering",
        position: "Associate Professor",
        phone: "+251 955 567 890",
        joinDate: "2019-11-05",
        documentsUploaded: 34,
        status: "active"
      }
    ]

    setFaculty(mockFaculty)
  }, [])

  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPositionBadge = (position: string) => {
    switch (position) {
      case "Professor":
        return <Badge className="bg-purple-100 text-purple-800">{position}</Badge>
      case "Associate Professor":
        return <Badge className="bg-blue-100 text-blue-800">{position}</Badge>
      case "Assistant Professor":
        return <Badge className="bg-emerald-100 text-emerald-800">{position}</Badge>
      default:
        return <Badge variant="outline">{position}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Faculty Management"
        subtitle="College of Engineering & Technology"
        backUrl="/dean/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Faculty Directory</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>
        </div>

        {/* Faculty List */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Faculty Members ({filteredFaculty.length})
            </CardTitle>
            <CardDescription>Manage and view all faculty members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFaculty.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        {getStatusBadge(member.status)}
                        {getPositionBadge(member.position)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {member.email}
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {member.department}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {member.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {member.documentsUploaded} documents
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Documents
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredFaculty.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No faculty members found matching your criteria.</p>
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
