"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ArrowLeft, Camera, Save, FileText, Award } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
}

interface StudentProfile {
  id: string
  name: string
  email: string
  phone: string | null
  department: string | null
  college: string
  joinDate: string | null
  address: string | null
  bio: string | null
  status: string
  lastLogin: string | null
}

interface Activity {
  id: number
  action: string
  document: string
  date: string
  status: string
}

interface Achievement {
  id: number
  title: string
  description: string
  date: string
}

export default function StudentProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState<Partial<StudentProfile>>({})

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
    
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getStudentProfile()
      
      if (response.success && response.data) {
        setProfileData(response.data)
        setEditForm(response.data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await apiClient.updateStudentProfile(editForm)
      
      if (response.success) {
        setIsEditing(false)
        loadProfile() // Reload profile data
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm(profileData || {})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile data</p>
          <Button onClick={loadProfile} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <PageHeader
        title="Student Profile"
        subtitle="Manage your academic profile"
        backUrl="/student/dashboard"
        user={user}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Edit Profile Buttons */}
        <div className="flex justify-end mb-6">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} className="bg-white hover:bg-gray-50 border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-blue-100">Update your personal details and academic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 bg-white border-2 border-blue-600 hover:bg-blue-50"
                      >
                        <Camera className="h-3 w-3 text-blue-600" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
                    <p className="text-sm text-gray-600">{profileData.email}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.email}</p>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">Student ID</Label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.id}</p>
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.department || 'Not assigned'}</p>
                  </div>

                  <div>
                    <Label htmlFor="college" className="text-sm font-medium text-gray-700">College</Label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.college}</p>
                  </div>

                  <div>
                    <Label htmlFor="year" className="text-sm font-medium text-gray-700">Academic Year</Label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.year}</p>
                  </div>

                  <div>
                    <Label htmlFor="gpa" className="text-sm font-medium text-gray-700">GPA</Label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.gpa}</p>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border">{profileData.address}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editForm.bio || ''}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        rows={3}
                        className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded-md border min-h-[60px]">{profileData.bio}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Academic Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle className="text-white">Academic Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Join Date</span>
                  <span className="text-sm font-medium text-gray-900">{profileData.joinDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current GPA</span>
                  <span className="text-sm font-medium text-gray-900">{profileData.gpa}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Academic Year</span>
                  <span className="text-sm font-medium text-gray-900">{profileData.year}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">Submitted Final Year Project Proposal</p>
                      <p className="text-xs text-purple-700">2024-01-20</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">Downloaded Machine Learning Research Paper</p>
                      <p className="text-xs text-green-700">2024-01-18</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Viewed Database Systems Assignment</p>
                      <p className="text-xs text-blue-700">2024-01-15</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                <CardTitle className="text-white flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Dean's List</h4>
                    <p className="text-sm text-yellow-700">Academic Excellence Award</p>
                    <p className="text-xs text-yellow-600 mt-1">2023-12-15</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800">Best Project Award</h4>
                    <p className="text-sm text-blue-700">Software Engineering Course</p>
                    <p className="text-xs text-blue-600 mt-1">2023-11-20</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800">Research Publication</h4>
                    <p className="text-sm text-green-700">Co-authored paper on AI applications</p>
                    <p className="text-xs text-green-600 mt-1">2023-10-10</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
