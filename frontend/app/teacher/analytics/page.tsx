"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Download,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Star,
  Loader2,
} from "lucide-react"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
}

interface TeacherAnalytics {
  totalDocuments: number
  approvedDocuments: number
  pendingDocuments: number
  rejectedDocuments: number
  totalDownloads: number
  totalViews: number
  approvalRate: number
  averageResponseTime: number
  monthlyUploads: number[]
  departmentRanking: number
  topDocuments: Array<{
    id: number
    title: string
    downloads: number
    views: number
    rating: number
  }>
}

export default function TeacherAnalytics() {
  const [user, setUser] = useState<User | null>(null)
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
    loadAnalytics()
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

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get teacher analytics from API
      const response = await apiClient.getTeacherAnalytics()
      if (response.success) {
        setAnalytics(response.data)
      } else {
        // Set empty analytics if API fails
        const emptyAnalytics: TeacherAnalytics = {
          totalDocuments: 0,
          approvedDocuments: 0,
          pendingDocuments: 0,
          rejectedDocuments: 0,
          totalDownloads: 0,
          totalViews: 0,
          approvalRate: 0,
          averageResponseTime: 0,
          monthlyUploads: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          departmentRanking: 0,
          topDocuments: []
        }
        setAnalytics(emptyAnalytics)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      setError('Failed to load analytics')
      toast.error('Failed to load analytics')
      
      // Set empty analytics on error
      const emptyAnalytics: TeacherAnalytics = {
        totalDocuments: 0,
        approvedDocuments: 0,
        pendingDocuments: 0,
        rejectedDocuments: 0,
        totalDownloads: 0,
        totalViews: 0,
        approvalRate: 0,
        averageResponseTime: 0,
        monthlyUploads: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        departmentRanking: 0,
        topDocuments: []
      }
      setAnalytics(emptyAnalytics)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusBg = (rate: number) => {
    if (rate >= 90) return 'bg-green-100'
    if (rate >= 80) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Analytics not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <PageHeader
        title="My Analytics"
        subtitle="Performance insights and statistics"
        backUrl="/teacher/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your performance and document statistics
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.totalDocuments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.approvalRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.totalDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Status */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-white flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Document Status
              </CardTitle>
              <CardDescription className="text-blue-100">Current document approval status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Approved</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(analytics.approvedDocuments / analytics.totalDocuments) * 100} className="w-20 h-2" />
                    <span className="font-semibold text-green-600">{analytics.approvedDocuments}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(analytics.pendingDocuments / analytics.totalDocuments) * 100} className="w-20 h-2" />
                    <span className="font-semibold text-yellow-600">{analytics.pendingDocuments}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(analytics.rejectedDocuments / analytics.totalDocuments) * 100} className="w-20 h-2" />
                    <span className="font-semibold text-red-600">{analytics.rejectedDocuments}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
              <CardDescription className="text-green-100">Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Department Ranking</span>
                  <Badge className="bg-blue-100 text-blue-800">#{analytics.departmentRanking}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="font-semibold text-gray-900">{analytics.averageResponseTime} days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Monthly Uploads</span>
                  <span className="font-semibold text-gray-900">{analytics.monthlyUploads[analytics.monthlyUploads.length - 1]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Documents */}
        <Card className="bg-white shadow-lg border-0 mt-8">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="text-white flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Top Performing Documents
            </CardTitle>
            <CardDescription className="text-purple-100">Your most popular and highly-rated documents</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analytics.topDocuments && analytics.topDocuments.length > 0 ? (
                analytics.topDocuments.map((doc, index) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Download className="h-4 h-4 mr-1" />
                            {doc.downloads} downloads
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 h-4 mr-1" />
                            {doc.views} views
                          </span>
                          <span className="flex items-center">
                            <Star className="h-4 h-4 mr-1" />
                            {doc.rating}/5.0
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-gray-300">
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No documents available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
