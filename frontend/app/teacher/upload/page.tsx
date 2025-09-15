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
    semester: "1",
    academic_year: "",
    tags: "",
    accessLevel: "department",
  })
  const [teacherDepartment, setTeacherDepartment] = useState<Department | null>(null)
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
    const files = event.target.files
    if (!files || files.length === 0) {
      setSelectedFiles([])
      return
    }
    
    const fileArray = Array.from(files)
    
    // Validate file size (50MB limit)
    const validFiles = fileArray.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: `File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 50MB.`
        })
        return false
      }
      return true
    })
    
    setSelectedFiles(validFiles)
    setUploadStatus({ type: null, message: '' })
  }

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    
    if (!files || files.length === 0) {
      setSelectedFiles([])
      return
    }
    
    const fileArray = Array.from(files)
    
    // Validate file size (50MB limit)
    const validFiles = fileArray.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: `File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 50MB.`
        })
        return false
      }
      return true
    })
    
    setSelectedFiles(validFiles)
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
          
          // Set teacher's department automatically
          const userInfo = localStorage.getItem('user_info')
          if (userInfo) {
            const userData = JSON.parse(userInfo)
            if (userData.department_id) {
              const teacherDept = departmentsResponse.data.find((dept: Department) => dept.id === userData.department_id)
              if (teacherDept) {
                setTeacherDepartment(teacherDept)
                setFormData(prev => ({ ...prev, department_id: teacherDept.id.toString() }))
              }
            }
          }
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
    if (!formData.title || !formData.author || !formData.department_id || !formData.category_id || !formData.document_type || !formData.semester || !formData.academic_year) {
      console.log('Validation failed:', {
        title: formData.title,
        author: formData.author,
        department_id: formData.department_id,
        category_id: formData.category_id,
        document_type: formData.document_type,
        semester: formData.semester,
        academic_year: formData.academic_year
      })
      setUploadStatus({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      setIsUploading(false)
      return
    }

    // Additional validation for empty strings
    if (!formData.title.trim() || !formData.author.trim() || 
        !formData.department_id.toString().trim() || 
        !formData.category_id.toString().trim() || 
        !formData.document_type.trim() || !formData.semester.trim() || !formData.academic_year.trim()) {
      console.log('Empty string validation failed')
      setUploadStatus({
        type: 'error',
        message: 'Please fill in all required fields (no empty values)'
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

      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('author', formData.author)
      formDataToSend.append('department_id', formData.department_id.toString())
      formDataToSend.append('category_id', formData.category_id.toString())
      formDataToSend.append('document_type', formData.document_type)
      formDataToSend.append('year', formData.year)
      formDataToSend.append('semester', formData.semester)
      formDataToSend.append('academic_year', formData.academic_year)
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
      
      const isSuccess = response && response.success
      
      if (isSuccess) {
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
          semester: "1",
          academic_year: "",
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
                  <p>• Maximum file size: 50MB per document</p>
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
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-white flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Select Files
              </CardTitle>
              <CardDescription className="text-blue-100">
                Upload documents for your courses. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT (Max: 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer bg-blue-25"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={handleDropZoneClick}
              >
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-600 mb-4">Maximum file size: 50MB per file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                />
              </div>

              {/* Selected Files */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Files selected: {selectedFiles.length}
                  {selectedFiles.length > 0 && (
                    <span className="block mt-2 text-green-600 font-medium">
                      {selectedFiles.map(f => f.name).join(', ')}
                    </span>
                  )}
                </p>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)} 
                        className="text-red-600 hover:text-red-700"
                      >
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
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Information
              </CardTitle>
              <CardDescription className="text-green-100">Provide details about the document(s) you're uploading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
                  <Input
                    placeholder="Enter document title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                    className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <Input
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    required
                    className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                    {teacherDepartment ? teacherDepartment.name : 'Loading...'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Department is automatically set based on your profile</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                  <Select value={formData.document_type} onValueChange={(value) => setFormData((prev) => ({ ...prev, document_type: value }))}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="lecture_notes">Lecture Notes</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="lab_manual">Lab Manual</SelectItem>
                      <SelectItem value="reference_material">Reference Material</SelectItem>
                      <SelectItem value="exam_paper">Exam Paper</SelectItem>
                      <SelectItem value="project_guidelines">Project Guidelines</SelectItem>
                      <SelectItem value="course_syllabus">Course Syllabus</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                    className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                  <Select value={formData.semester} onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
                  <Select value={formData.academic_year} onValueChange={(value) => setFormData((prev) => ({ ...prev, academic_year: value }))}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                      <SelectItem value="5th Year">5th Year</SelectItem>
                      <SelectItem value="Final Year">Final Year</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  placeholder="Enter document description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                    className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer bg-green-100 text-green-800 border-green-200" onClick={() => removeTag(tag)}>
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="pt-6 p-6">
              {selectedFiles.length === 0 && (
                <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">Please select at least one file to upload.</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Link href="/teacher/dashboard">
                  <Button type="button" variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
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
                    !formData.semester ||
                    !formData.academic_year ||
                    isUploading
                  }
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
