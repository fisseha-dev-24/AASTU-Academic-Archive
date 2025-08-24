"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, TrendingUp, Eye, Download, Users, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const analyticsData = {
  overview: {
    totalViews: 12847,
    totalDownloads: 3456,
    avgRating: 4.7,
    totalDocuments: 156,
    monthlyGrowth: 23.5,
  },
  topDocuments: [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      course: "Artificial Intelligence",
      views: 2456,
      downloads: 789,
      rating: 4.9,
      uploadedAt: "2024-01-10",
    },
    {
      id: 2,
      title: "Database Design Fundamentals",
      course: "Database Systems",
      views: 1987,
      downloads: 654,
      rating: 4.8,
      uploadedAt: "2024-01-08",
    },
    {
      id: 3,
      title: "Web Development Best Practices",
      course: "Web Development",
      views: 1654,
      downloads: 432,
      rating: 4.6,
      uploadedAt: "2024-01-05",
    },
  ],
  coursePerformance: [
    {
      course: "Artificial Intelligence",
      documents: 45,
      totalViews: 5678,
      totalDownloads: 1234,
      avgRating: 4.8,
      students: 32,
    },
    {
      course: "Database Systems",
      documents: 38,
      totalViews: 4321,
      totalDownloads: 987,
      avgRating: 4.7,
      students: 28,
    },
    {
      course: "Web Development",
      documents: 41,
      totalViews: 2848,
      totalDownloads: 765,
      avgRating: 4.5,
      students: 30,
    },
  ],
  monthlyStats: [
    { month: "Jan", views: 2456, downloads: 678 },
    { month: "Feb", views: 2789, downloads: 723 },
    { month: "Mar", views: 3123, downloads: 856 },
    { month: "Apr", views: 2945, downloads: 789 },
    { month: "May", views: 3456, downloads: 912 },
    { month: "Jun", views: 3789, downloads: 1023 },
  ],
}

export default function TeacherAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/teacher/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Track your document performance and engagement</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>DT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.overview.totalViews.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />+{analyticsData.overview.monthlyGrowth}% this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {analyticsData.overview.totalDownloads.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600">Across all documents</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <BarChart3 className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{analyticsData.overview.avgRating}/5.0</div>
                  <p className="text-xs text-gray-600">Student feedback</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.overview.totalDocuments}</div>
                  <p className="text-xs text-gray-600">Published materials</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <Users className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">26.9%</div>
                  <p className="text-xs text-gray-600">Downloads/Views ratio</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Views and downloads over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
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
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Documents</CardTitle>
                <CardDescription>Your most viewed and downloaded course materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topDocuments.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-6 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{doc.title}</h4>
                          <p className="text-sm text-gray-600">Course: {doc.course}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center text-blue-600">
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="font-medium">{doc.views.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center text-emerald-600">
                            <Download className="h-4 w-4 mr-1" />
                            <span className="font-medium">{doc.downloads.toLocaleString()}</span>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.coursePerformance.map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.course}</CardTitle>
                    <CardDescription>
                      {course.documents} documents • {course.students} students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-blue-600 mb-1">
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="font-medium">{course.totalViews.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Total Views</p>
                        </div>
                        <div>
                          <div className="flex items-center text-emerald-600 mb-1">
                            <Download className="h-4 w-4 mr-1" />
                            <span className="font-medium">{course.totalDownloads.toLocaleString()}</span>
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
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Monthly views and downloads comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive trend analysis chart</p>
                    <p className="text-sm text-gray-400">Monthly performance comparison</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Activity Hours</CardTitle>
                  <CardDescription>When students are most active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">9:00 AM - 11:00 AM</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-blue-200 rounded-full mr-2">
                          <div className="w-16 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">80%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2:00 PM - 4:00 PM</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-blue-200 rounded-full mr-2">
                          <div className="w-14 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">70%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">7:00 PM - 9:00 PM</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-blue-200 rounded-full mr-2">
                          <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Types Performance</CardTitle>
                  <CardDescription>Most popular content types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lecture Notes</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full mr-2">
                          <div className="w-18 h-2 bg-emerald-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">90%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tutorials</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full mr-2">
                          <div className="w-14 h-2 bg-emerald-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">70%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reference Materials</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full mr-2">
                          <div className="w-10 h-2 bg-emerald-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">50%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
