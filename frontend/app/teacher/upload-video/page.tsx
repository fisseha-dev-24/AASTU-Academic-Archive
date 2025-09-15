"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Video, Link, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string | { name: string }
  department_id?: number
}

interface Department {
  id: number
  name: string
  code: string
}

interface Category {
  id: number
  name: string
  description?: string
}

export default function UploadVideoPage() {
  const [user, setUser] = useState<User | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    department_id: "",
    category_id: "",
    year: new Date().getFullYear().toString(),
    keywords: ""
  })

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    try {
      // Load user info
      const userInfo = localStorage.getItem('user_info')
      if (userInfo) {
        setUser(JSON.parse(userInfo))
      }

      // Load departments and categories
      const [deptResponse, catResponse] = await Promise.all([
        apiClient.getTeacherDepartments(),
        apiClient.getTeacherCategories()
      ])

      if (deptResponse.success) {
        setDepartments(deptResponse.data || [])
      }

      if (catResponse.success) {
        setCategories(catResponse.data || [])
      }
    } catch (error) {
      console.error('Error loading page data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.video_url.trim()) {
      setError("Video URL is required")
      return false
    }
    if (!formData.department_id) {
      setError("Department is required")
      return false
    }
    if (!formData.year || formData.year.length !== 4) {
      setError("Valid year is required")
      return false
    }

    // Basic URL validation
    try {
      new URL(formData.video_url)
    } catch {
      setError("Please enter a valid URL")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    setError("")

    try {
      const response = await apiClient.uploadVideo({
        title: formData.title.trim(),
        description: formData.description.trim(),
        video_url: formData.video_url.trim(),
        department_id: parseInt(formData.department_id),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        year: parseInt(formData.year),
        keywords: formData.keywords.trim()
      })

      if (response.success) {
        setSuccess(true)
        // Reset form
        setFormData({
          title: "",
          description: "",
          video_url: "",
          department_id: "",
          category_id: "",
          year: new Date().getFullYear().toString(),
          keywords: ""
        })
      } else {
        setError(response.message || "Failed to upload video")
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      setError("An error occurred while uploading the video")
    } finally {
      setSubmitting(false)
    }
  }

  const getDepartmentName = () => {
    if (user?.department) {
      if (typeof user.department === 'string') {
        return user.department
      } else if (typeof user.department === 'object' && user.department.name) {
        return user.department.name
      }
    }
    return "Department"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading upload form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PageHeader
        title="Upload Video"
        subtitle="Share educational video content with students"
        backUrl="/teacher/dashboard"
        user={user}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Video uploaded successfully! It will be reviewed by your department head before being made available to students.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-6 w-6 text-red-600" />
              <span>Video Upload Form</span>
            </CardTitle>
            <CardDescription>
              Upload educational videos from YouTube or Vimeo. Videos will be reviewed by your department head before being published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the video content and learning objectives"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL *</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => handleInputChange('video_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Supported platforms: YouTube and Vimeo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => handleInputChange('department_id', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    You can only upload to your department: {getDepartmentName()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder="Enter keywords separated by commas"
                />
                <p className="text-sm text-gray-500">
                  Help students find your video with relevant keywords
                </p>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-gray-500">
                  <p>• Videos will be reviewed before publication</p>
                  <p>• Only YouTube and Vimeo links are supported</p>
                  <p>• Ensure you have permission to share the content</p>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

