"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Building2,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
}

interface AnalyticsData {
  document_activity: {
    total_uploads: number
    total_approvals: number
    approval_rate: number
  }
  user_activity: {
    new_users: number
    active_users: number
  }
  department_performance: Array<{
    department: string
    total_documents: number
    approved_documents: number
    approval_rate: number
  }>
}

export default function DeanAnalytics() {
  const [user, setUser] = useState<User | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState("monthly")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    loadUserData()
    loadAnalytics()
  }, [reportType, startDate, endDate])

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
      // Use dashboard data for more comprehensive analytics
      const response = await apiClient.getDeanDashboard()
      
      if (response.success && response.data) {
        const stats = response.data.stats
        const departmentData = response.data.department_analytics
        
        // Transform the backend data to match frontend expectations
        const transformedData = {
          document_activity: {
            total_uploads: stats.total_documents,
            total_approvals: stats.approved_this_month,
            approval_rate: stats.total_documents > 0 ? Math.round((stats.approved_this_month / stats.total_documents) * 100) : 0
          },
          user_activity: {
            new_users: stats.total_teachers + stats.total_students,
            active_users: stats.total_teachers
          },
          department_performance: departmentData.map((dept: any) => ({
            department: dept.name,
            total_documents: dept.total_documents,
            approved_documents: dept.approved_documents,
            approval_rate: dept.approval_rate
          }))
        }
        
        setAnalytics(transformedData)
        toast.success('Report generated successfully')
      } else {
        setError('Failed to load analytics data')
        toast.error('Failed to load analytics data')
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      setError('Failed to load analytics data')
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
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
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="College Analytics"
        subtitle="Comprehensive insights and performance metrics"
        backUrl="/dean/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Controls */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
              <Button onClick={loadAnalytics} className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Card className="shadow-lg border-0 bg-red-50 border-red-200 mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-blue-700">Total Uploads</CardTitle>
                  <FileText className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.document_activity.total_uploads.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Documents uploaded</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-green-700">Approval Rate</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.document_activity.approval_rate}%
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Success rate</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-purple-700">New Users</CardTitle>
                  <Users className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.user_activity.new_users.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">This period</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-orange-700">Active Users</CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {analytics.user_activity.active_users.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Engaged users</p>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance */}
            <Card className="bg-white border border-gray-200 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>Department Performance</span>
                </CardTitle>
                <CardDescription>Performance metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.department_performance.map((dept, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                        <Badge className={`${getApprovalRateBg(dept.approval_rate)} ${getApprovalRateColor(dept.approval_rate)}`}>
                          {dept.approval_rate}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Total Documents</div>
                          <div className="font-semibold text-blue-600">{dept.total_documents}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Approved</div>
                          <div className="font-semibold text-green-600">{dept.approved_documents}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Pending</div>
                          <div className="font-semibold text-yellow-600">
                            {dept.total_documents - dept.approved_documents}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Document Activity</span>
                  </CardTitle>
                  <CardDescription>Upload and approval trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">Total Uploads</span>
                      <span className="text-lg font-bold text-blue-700">
                        {analytics.document_activity.total_uploads}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700">Total Approvals</span>
                      <span className="text-lg font-bold text-green-700">
                        {analytics.document_activity.total_approvals}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-700">Approval Rate</span>
                      <span className="text-lg font-bold text-purple-700">
                        {analytics.document_activity.approval_rate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>User Activity</span>
                  </CardTitle>
                  <CardDescription>User engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">New Users</span>
                      <span className="text-lg font-bold text-blue-700">
                        {analytics.user_activity.new_users}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700">Active Users</span>
                      <span className="text-lg font-bold text-green-700">
                        {analytics.user_activity.active_users}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-orange-700">Engagement Rate</span>
                      <span className="text-lg font-bold text-orange-700">
                        {analytics.user_activity.new_users > 0 
                          ? Math.round((analytics.user_activity.active_users / analytics.user_activity.new_users) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="shadow-lg border-0 bg-gray-50 border-gray-200">
            <CardContent className="p-12">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No analytics data available</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your report parameters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
