"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, TrendingUp, Eye, Download, Users, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface AnalyticsData {
  overview: {
    totalViews: number
    totalDownloads: number
    avgRating: number
    totalDocuments: number
    monthlyGrowth: number
  }
  topDocuments: Array<{
    id: number
    title: string
    author: string
    views: number
    downloads: number
    rating: number
    created_at: string
    document_type: string
  }>
  coursePerformance: Array<{
    course: string
    documents: number
    totalViews: number
    totalDownloads: number
    avgRating: number
    students: number
  }>
  monthlyStats: Array<{
    month: string
    views: number
    downloads: number
  }>
}

export default function TeacherAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")
  const [user, setUser] = useState<User | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

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

    const loadAnalytics = async () => {
      try {
        const response = await apiClient.getTeacherAnalytics()
        if (response.success && response.data) {
          setAnalyticsData(response.data)
        }
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PageHeader 
        title="Analytics Dashboard"
        subtitle="Track your document performance and engagement"
        showBackButton={true}
        backUrl="/teacher/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Top Documents</TabsTrigger>
            <TabsTrigger value="courses">Course Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(analyticsData.overview.totalViews)}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />+{analyticsData.overview.monthlyGrowth}% this month
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-700">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatNumber(analyticsData.overview.totalDownloads)}
                  </div>
                  <p className="text-xs text-gray-600">Across all documents</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">Average Rating</CardTitle>
                  <BarChart3 className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{analyticsData.overview.avgRating}/5.0</div>
                  <p className="text-xs text-gray-600">Student feedback</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.overview.totalDocuments}</div>
                  <p className="text-xs text-gray-600">Published materials</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-indigo-700">Engagement Rate</CardTitle>
                  <Users className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">
                    {analyticsData.overview.totalViews > 0 
                      ? Math.round((analyticsData.overview.totalDownloads / analyticsData.overview.totalViews) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-gray-600">Downloads/Views ratio</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance Chart Placeholder */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="text-blue-900">Monthly Performance</CardTitle>
                <CardDescription className="text-blue-700">Views and downloads over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive chart showing monthly trends</p>
                    <p className="text-sm text-gray-400">Views and downloads comparison</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="text-green-900">Top Performing Documents</CardTitle>
                <CardDescription className="text-green-700">Your most viewed and downloaded course materials</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {analyticsData.topDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents available for analytics</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyticsData.topDocuments.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                          <p className="text-sm text-gray-600">Author: {doc.author}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {formatDate(doc.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="flex items-center text-blue-600">
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="font-medium">{formatNumber(doc.views)}</span>
                            </div>
                            <p className="text-xs text-gray-500">Views</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center text-emerald-600">
                              <Download className="h-4 w-4 mr-1" />
                              <span className="font-medium">{formatNumber(doc.downloads)}</span>
                            </div>
                            <p className="text-xs text-gray-500">Downloads</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center text-yellow-600">
                              <span className="font-medium">{doc.rating}</span>
                              <span className="text-xs ml-1">★</span>
                            </div>
                            <p className="text-xs text-gray-500">Rating</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            {analyticsData.coursePerformance.length === 0 ? (
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No course performance data available</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyticsData.coursePerformance.map((course, index) => (
                  <Card key={index} className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
                      <CardTitle className="text-lg text-purple-900">{course.course}</CardTitle>
                      <CardDescription className="text-purple-700">
                        {course.documents} documents • {course.students} students
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center text-blue-600 mb-1">
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="font-medium">{formatNumber(course.totalViews)}</span>
                            </div>
                            <p className="text-xs text-gray-500">Total Views</p>
                          </div>
                          <div>
                            <div className="flex items-center text-emerald-600 mb-1">
                              <Download className="h-4 w-4 mr-1" />
                              <span className="font-medium">{formatNumber(course.totalDownloads)}</span>
                            </div>
                            <p className="text-xs text-gray-500">Total Downloads</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center text-yellow-600">
                              <span className="font-medium">{course.avgRating}</span>
                              <span className="text-sm ml-1">★</span>
                            </div>
                            <p className="text-xs text-gray-500">Avg Rating</p>
                          </div>
                          <Button size="sm" variant="outline" className="hover:bg-purple-100">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <CardTitle className="text-orange-900">Engagement Trends</CardTitle>
                <CardDescription className="text-orange-700">Monthly views and downloads comparison</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive trend analysis chart</p>
                    <p className="text-sm text-gray-400">Monthly performance comparison</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <CardTitle className="text-blue-900">Peak Activity Hours</CardTitle>
                  <CardDescription className="text-blue-700">When students are most active</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">9:00 AM - 11:00 AM</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-blue-200 rounded-full">
                          <div className="w-16 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 ml-2">80%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2:00 PM - 4:00 PM</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-blue-200 rounded-full">
                          <div className="w-14 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 ml-2">70%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">7:00 PM - 9:00 PM</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-blue-200 rounded-full">
                          <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 ml-2">60%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
                  <CardTitle className="text-emerald-900">Document Types Performance</CardTitle>
                  <CardDescription className="text-emerald-700">Most popular content types</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lecture Notes</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full">
                          <div className="w-18 h-2 bg-emerald-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 ml-2">90%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tutorials</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full">
                          <div className="w-14 h-2 bg-emerald-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 ml-2">70%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reference Materials</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full">
                          <div className="w-10 h-2 bg-emerald-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 ml-2">50%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  )
}
