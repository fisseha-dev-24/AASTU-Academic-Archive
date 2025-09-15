"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Mail,
  Phone,
  Users,
  Calendar,
  Edit3,
  Save,
  X,
  Loader2,
  GraduationCap,
  FileText,
  Clock,
  TrendingUp,
  MapPin,
  Globe,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
}

interface DepartmentProfile {
  id: number
  name: string
  code: string
  description: string
  email: string
  phone: string
  website: string
  location: string
  establishedDate: string
  headOfDepartment: string
  totalFaculty: number
  totalStudents: number
  totalDocuments: number
  pendingDocuments: number
  approvedDocuments: number
  approvalRate: number
  mission: string
  vision: string
  objectives: string[]
}

export default function DepartmentProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<DepartmentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<DepartmentProfile>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadUserData()
    loadProfile()
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

  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get department profile from API
      const response = await apiClient.getDepartmentProfile()
      if (response.success) {
        setProfile(response.data)
        setEditForm(response.data)
      } else {
        // Set empty profile if API fails
        const emptyProfile: DepartmentProfile = {
          id: 0,
          name: "",
          code: "",
          description: "",
          email: "",
          phone: "",
          website: "",
          location: "",
          establishedDate: "",
          headOfDepartment: "",
          totalFaculty: 0,
          totalStudents: 0,
          totalDocuments: 0,
          pendingDocuments: 0,
          approvedDocuments: 0,
          approvalRate: 0,
          mission: "",
          vision: "",
          objectives: []
        }
        setProfile(emptyProfile)
        setEditForm(emptyProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
      toast.error('Failed to load profile')
      
      // Set empty profile on error
      const emptyProfile: DepartmentProfile = {
        id: 0,
        name: "",
        code: "",
        description: "",
        email: "",
        phone: "",
        website: "",
        location: "",
        establishedDate: "",
        headOfDepartment: "",
        totalFaculty: 0,
        totalStudents: 0,
        totalDocuments: 0,
        pendingDocuments: 0,
        approvedDocuments: 0,
        approvalRate: 0,
        mission: "",
        vision: "",
        objectives: []
      }
      setProfile(emptyProfile)
      setEditForm(emptyProfile)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm(profile || {})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm(profile || {})
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfile(prev => prev ? { ...prev, ...editForm } : null)
      setIsEditing(false)
      toast.success('Department profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof DepartmentProfile, value: string | string[]) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading department profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Department profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Department Profile"
        subtitle="Manage your department information and settings"
        backUrl="/department/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your department information and settings
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {!isEditing ? (
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Department Info Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="text-2xl font-semibold">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{profile.name}</h2>
                  <p className="text-gray-600 mb-1">Department Code: {profile.code}</p>
                  <p className="text-gray-500 text-sm mb-4">Established: {new Date(profile.establishedDate).getFullYear()}</p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{profile.website}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Head: {profile.headOfDepartment}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Department Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Faculty</span>
                  <span className="font-semibold text-blue-600">{profile.totalFaculty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-semibold text-green-600">{profile.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documents</span>
                  <span className="font-semibold text-purple-600">{profile.totalDocuments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Approval Rate</span>
                  <Badge className={`${getApprovalRateBg(profile.approvalRate)} ${getApprovalRateColor(profile.approvalRate)}`}>
                    {profile.approvalRate}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    {isEditing ? (
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter department name"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                    {isEditing ? (
                      <Input
                        value={editForm.code || ''}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        placeholder="Enter department code"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.code}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <Input
                        value={editForm.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email"
                        type="email"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <Input
                        value={editForm.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    {isEditing ? (
                      <Input
                        value={editForm.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="Enter website URL"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.website}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    {isEditing ? (
                      <Input
                        value={editForm.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter location"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.location}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter department description"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mission & Vision */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Mission & Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.mission || ''}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                      placeholder="Enter department mission"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.mission}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.vision || ''}
                      onChange={(e) => handleInputChange('vision', e.target.value)}
                      placeholder="Enter department vision"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.vision}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Department Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    {(editForm.objectives || []).map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={objective}
                          onChange={(e) => {
                            const newObjectives = [...(editForm.objectives || [])]
                            newObjectives[index] = e.target.value
                            handleInputChange('objectives', newObjectives)
                          }}
                          placeholder={`Objective ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newObjectives = (editForm.objectives || []).filter((_, i) => i !== index)
                            handleInputChange('objectives', newObjectives)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newObjectives = [...(editForm.objectives || []), '']
                        handleInputChange('objectives', newObjectives)
                      }}
                      className="w-full"
                    >
                      Add Objective
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {profile.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 font-semibold">•</span>
                        <span className="text-gray-900">{objective}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
