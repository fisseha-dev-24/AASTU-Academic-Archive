"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, FileText, X, Plus, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

interface Category {
  id: number
  name: string
}

interface Department {
  id: number
  name: string
}

export default function TeacherUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    department_id: "",
    category_id: "",
    document_type: "",
    year: new Date().getFullYear().toString(),
    tags: "",
    accessLevel: "department",
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validate file size (5MB limit)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: `File "${file.name}" is too large. Maximum size is 5MB.`
        })
        return false
      }
      return true
    })
    
    setSelectedFiles(validFiles) // Replace instead of append
    setUploadStatus({ type: null, message: '' })
    
    // Clear the input value to allow selecting the same file again
    event.target.value = ''
  }

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    
    // Validate file size (5MB limit)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: `File "${file.name}" is too large. Maximum size is 5MB.`
        })
        return false
      }
      return true
    })
    
    setSelectedFiles(validFiles) // Replace instead of append
    setUploadStatus({ type: null, message: '' })
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags((prev) => [...prev, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

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

    const loadFormData = async () => {
      // Check if user is logged in
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setUploadStatus({
          type: 'error',
          message: 'You are not logged in. Please log in first.'
        })
        setLoading(false)
        return
      }

      try {
        // Load categories and departments in parallel
        const [categoriesResponse, departmentsResponse] = await Promise.all([
          apiClient.getTeacherCategories(),
          apiClient.getTeacherDepartments()
        ])

        // Handle categories
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data)
          console.log('Categories loaded successfully:', categoriesResponse.data.length)
        } else {
          console.error('Categories failed:', categoriesResponse)
          setUploadStatus({
            type: 'error',
            message: 'Failed to load categories. Please refresh the page.'
          })
        }

        // Handle departments
        if (departmentsResponse.success && departmentsResponse.data) {
          setDepartments(departmentsResponse.data)
          console.log('Departments loaded successfully:', departmentsResponse.data.length)
        } else {
          console.error('Departments failed:', departmentsResponse)
          setUploadStatus({
            type: 'error',
            message: 'Failed to load departments. Please refresh the page.'
          })
        }
      } catch (error) {
        setUploadStatus({
          type: 'error',
          message: `Failed to load form data: ${error instanceof Error ? error.message : 'Unknown error'}. Please refresh the page.`
        })
      } finally {
        setLoading(false)
      }
    }

    loadFormData()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsUploading(true)
    setUploadStatus({ type: null, message: '' })

    // Check if user is logged in
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      setUploadStatus({
        type: 'error',
        message: 'You are not logged in. Please log in and try again.'
      })
      setIsUploading(false)
      return
    }

    // Validate required fields
    if (!formData.title || !formData.author || !formData.department_id || !formData.category_id || !formData.document_type || !formData.year || selectedFiles.length === 0) {
      setUploadStatus({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      setIsUploading(false)
      return
    }

    try {
      if (selectedFiles.length === 0) {
        setUploadStatus({
          type: 'error',
          message: 'Please select at least one file to upload'
        })
        setIsUploading(false)
        return
      }

      if (!formData.title || !formData.author || !formData.department_id || !formData.category_id || !formData.document_type) {
        setUploadStatus({
          type: 'error',
          message: 'Please fill in all required fields'
        })
        setIsUploading(false)
        return
      }

      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('author', formData.author)
              formDataToSend.append('department_id', formData.department_id.toString())
        formDataToSend.append('category_id', formData.category_id.toString())
      formDataToSend.append('document_type', formData.document_type)
      formDataToSend.append('year', formData.year)
      formDataToSend.append('tags', tags.join(', '))



      // Add file
      if (selectedFiles.length > 0) {
        formDataToSend.append('file', selectedFiles[0])
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Please select a file to upload.'
        })
        setIsUploading(false)
        return
      }

      const response = await apiClient.uploadDocument(formDataToSend)
      
      if (response.success) {
        setUploadStatus({
          type: 'success',
          message: 'Document uploaded successfully! It will be reviewed by the department.'
        })
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          author: "",
          department_id: "",
          category_id: "",
          document_type: "",
          year: new Date().getFullYear().toString(),
          tags: "",
          accessLevel: "department",
        })
        setSelectedFiles([])
        setTags([])
        
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        // Show specific validation errors if available
        let errorMessage = 'Upload failed. Please try again.'
        if (response.message) {
          if (typeof response.message === 'string') {
            errorMessage = response.message
          } else if (typeof response.message === 'object') {
            errorMessage = JSON.stringify(response.message)
          }
        }
        if (response.errors) {
          const errorDetails = Object.values(response.errors).flat().join(', ')
          errorMessage = `Validation failed: ${errorDetails}`
        }
        setUploadStatus({
          type: 'error',
          message: errorMessage
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({
        type: 'error',
        message: 'Upload failed. Please check your connection and try again.'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading upload form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PageHeader
        title="Upload Document"
        subtitle="Share your academic materials with students"
        backUrl="/teacher/dashboard"
        user={user}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Upload Guidelines</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>• Maximum file size: 5MB per document</p>
                  <p>• Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT</p>
                  <p>• All uploads will be reviewed by department heads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Status Alert */}
        {uploadStatus.type && (
          <Alert className={`mb-6 ${uploadStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {uploadStatus.message}
            </AlertDescription>
          </Alert>
        )}







        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-blue-900">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Select Files
              </CardTitle>
              <CardDescription className="text-blue-700">
                Upload documents for your courses. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT (Max: 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer bg-blue-25"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={handleDropZoneClick}
              >
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-600 mb-4">Maximum file size: 5MB per file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  onChange={handleFileSelect}
                  className="sr-only"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="inline-flex items-center px-6 py-3 border border-blue-300 rounded-lg shadow-sm text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
                >
                  Choose Files
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-gray-900">Selected Files ({selectedFiles.length})</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-800">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Information */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center text-green-900">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Document Information
              </CardTitle>
              <CardDescription className="text-green-700">Provide details about the document(s) you're uploading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
                  <Input
                    placeholder="Enter document title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <Input
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <Select value={formData.department_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, department_id: value }))}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      {departments.length > 0 ? (
                        departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()} className="select-item">
                            {dept.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled className="select-item">Loading departments...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()} className="select-item">
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled className="select-item">Loading categories...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                  <Select value={formData.document_type} onValueChange={(value) => setFormData((prev) => ({ ...prev, document_type: value }))}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectItem value="lecture_notes" className="select-item">Lecture Notes</SelectItem>
                      <SelectItem value="assignment" className="select-item">Assignment</SelectItem>
                      <SelectItem value="lab_manual" className="select-item">Lab Manual</SelectItem>
                      <SelectItem value="reference_material" className="select-item">Reference Material</SelectItem>
                      <SelectItem value="exam_paper" className="select-item">Exam Paper</SelectItem>
                      <SelectItem value="project_guidelines" className="select-item">Project Guidelines</SelectItem>
                      <SelectItem value="course_syllabus" className="select-item">Course Syllabus</SelectItem>
                      <SelectItem value="other" className="select-item">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <Input
                    type="number"
                    placeholder="Enter year"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  placeholder="Enter document description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="pt-6">
              {selectedFiles.length === 0 && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Please select at least one file to upload.</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Link href="/teacher/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={
                    selectedFiles.length === 0 ||
                    !formData.title ||
                    !formData.author ||
                    !formData.department_id ||
                    !formData.category_id ||
                    !formData.document_type ||
                    isUploading
                  }
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
