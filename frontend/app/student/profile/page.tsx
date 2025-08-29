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
  phone: string
  department: string
  college: string
  year: string
  gpa: string
  joinDate: string
  address: string
  bio: string
  interests: string[]
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
    <div className="min-h-screen bg-gray-50">
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
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and academic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{profileData.name}</h3>
                    <p className="text-sm text-gray-500">{profileData.email}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <p className="text-sm text-gray-900 mt-1">{profileData.email}</p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <p className="text-sm text-gray-900 mt-1">{profileData.id}</p>
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <p className="text-sm text-gray-900 mt-1">{profileData.department}</p>
                  </div>

                  <div>
                    <Label htmlFor="college">College</Label>
                    <p className="text-sm text-gray-900 mt-1">{profileData.college}</p>
                  </div>

                  <div>
                    <Label htmlFor="year">Academic Year</Label>
                    <p className="text-sm text-gray-900 mt-1">{profileData.year}</p>
                  </div>

                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <p className="text-sm text-gray-900 mt-1">{profileData.gpa}</p>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{profileData.address}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editForm.bio || ''}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{profileData.bio}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label>Academic Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
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
            <Card>
              <CardHeader>
                <CardTitle>Academic Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Join Date</span>
                  <span className="text-sm font-medium">{profileData.joinDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current GPA</span>
                  <span className="text-sm font-medium">{profileData.gpa}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Academic Year</span>
                  <span className="text-sm font-medium">{profileData.year}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Submitted Final Year Project Proposal</p>
                      <p className="text-xs text-gray-500">2024-01-20</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Downloaded Machine Learning Research Paper</p>
                      <p className="text-xs text-gray-500">2024-01-18</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Viewed Database Systems Assignment</p>
                      <p className="text-xs text-gray-500">2024-01-15</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
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
