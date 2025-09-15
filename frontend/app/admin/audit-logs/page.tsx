"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
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
}

interface AuditLog {
  id: number
  user_id: number
  user_name: string
  action: string
  details: string
  ip_address: string
  created_at: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export default function AdminAuditLogs() {
  const [user, setUser] = useState<User | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    loadUserData()
    loadAuditLogs()
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

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      // Mock data for now - in real implementation, this would come from API
      setAuditLogs([
        {
          id: 1,
          user_id: 48,
          user_name: 'System Administrator',
          action: 'student_import',
          details: 'Imported 3 students from demo_students.csv',
          ip_address: '127.0.0.1',
          created_at: '2025-09-14 19:46:29',
          severity: 'medium'
        },
        {
          id: 2,
          user_id: 10,
          user_name: 'Dr. Abebe Kebede',
          action: 'document_upload',
          details: 'Uploaded document: Advanced Architecture Design Principles',
          ip_address: '192.168.1.100',
          created_at: '2025-09-14 15:30:22',
          severity: 'low'
        },
        {
          id: 3,
          user_id: 6,
          user_name: 'Prof. Yonas Tadesse',
          action: 'document_approval',
          details: 'Approved document: Software Engineering Fundamentals',
          ip_address: '192.168.1.101',
          created_at: '2025-09-14 14:15:10',
          severity: 'low'
        },
        {
          id: 4,
          user_id: 48,
          user_name: 'System Administrator',
          action: 'user_creation',
          details: 'Created new user: admin@aastu.edu.et',
          ip_address: '127.0.0.1',
          created_at: '2025-09-14 19:46:00',
          severity: 'high'
        },
        {
          id: 5,
          user_id: 14,
          user_name: 'Meron Tsegaye',
          action: 'document_download',
          details: 'Downloaded document: Civil Engineering Materials',
          ip_address: '192.168.1.102',
          created_at: '2025-09-14 13:45:33',
          severity: 'low'
        },
        {
          id: 6,
          user_id: 2,
          user_name: 'Dr. Alemayehu Tadesse',
          action: 'system_access',
          details: 'Accessed dean dashboard',
          ip_address: '192.168.1.103',
          created_at: '2025-09-14 12:20:15',
          severity: 'low'
        },
        {
          id: 7,
          user_id: 48,
          user_name: 'System Administrator',
          action: 'failed_login',
          details: 'Failed login attempt for user: unknown@aastu.edu.et',
          ip_address: '192.168.1.200',
          created_at: '2025-09-14 11:30:45',
          severity: 'high'
        },
        {
          id: 8,
          user_id: 10,
          user_name: 'Dr. Abebe Kebede',
          action: 'document_rejection',
          details: 'Rejected document: Incomplete Research Paper',
          ip_address: '192.168.1.100',
          created_at: '2025-09-14 10:15:20',
          severity: 'medium'
        }
      ])
    } catch (error) {
      console.error('Error loading audit logs:', error)
      toast.error('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'student_import':
      case 'user_creation':
        return <User className="h-4 w-4" />
      case 'document_upload':
      case 'document_download':
      case 'document_approval':
      case 'document_rejection':
        return <FileText className="h-4 w-4" />
      case 'system_access':
        return <Activity className="h-4 w-4" />
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    
    // Simple date filtering (last 7 days, 30 days, all)
    let matchesDate = true
    if (dateFilter !== "all") {
      const logDate = new Date(log.created_at)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dateFilter === "7days" && daysDiff > 7) matchesDate = false
      if (dateFilter === "30days" && daysDiff > 30) matchesDate = false
    }
    
    return matchesSearch && matchesAction && matchesSeverity && matchesDate
  })

  const handleExportLogs = () => {
    const csvContent = [
      ['ID', 'User', 'Action', 'Details', 'IP Address', 'Date', 'Severity'],
      ...filteredLogs.map(log => [
        log.id,
        log.user_name,
        log.action,
        log.details,
        log.ip_address,
        log.created_at,
        log.severity
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success('Audit logs exported successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Audit Logs"
        subtitle="System activity and security audit trail"
        backUrl="/admin/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audit Trail</h2>
            <p className="text-gray-600">Monitor system activities and security events</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleExportLogs} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={loadAuditLogs} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="student_import">Student Import</SelectItem>
                  <SelectItem value="user_creation">User Creation</SelectItem>
                  <SelectItem value="document_upload">Document Upload</SelectItem>
                  <SelectItem value="document_approval">Document Approval</SelectItem>
                  <SelectItem value="document_rejection">Document Rejection</SelectItem>
                  <SelectItem value="system_access">System Access</SelectItem>
                  <SelectItem value="failed_login">Failed Login</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Audit Logs ({filteredLogs.length})
              </div>
            </CardTitle>
            <CardDescription>
              System activity log with {auditLogs.length} total entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No audit logs found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-sm">{log.action.replace('_', ' ').toUpperCase()}</h4>
                            {getSeverityBadge(log.severity)}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {log.user_name}
                            </div>
                            <div className="flex items-center">
                              <Activity className="w-3 h-3 mr-1" />
                              {log.ip_address}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(log.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

