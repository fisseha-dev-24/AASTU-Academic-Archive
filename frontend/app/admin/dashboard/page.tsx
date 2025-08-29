"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  Activity,
  Search,
  CheckCircle,
  AlertTriangle,
  Shield,
  Settings,
  Monitor,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Server,
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

interface AdminStats {
  total_users: number
  active_sessions: number
  total_documents: number
  system_health: string
  storage_usage: {
    total: string
    used: string
    available: string
    usage_percentage: number
  }
  recent_logins: number
  failed_attempts: number
  system_uptime: string
}

interface SystemMonitoring {
  database_status: {
    status: string
    connections: number
    response_time: string
  }
  file_system_status: {
    status: string
    read_permissions: boolean
    write_permissions: boolean
    storage_accessible: boolean
  }
  api_performance: {
    average_response_time: string
    requests_per_minute: number
    error_rate: string
  }
  error_logs: {
    total_errors_today: number
    critical_errors: number
    warning_errors: number
  }
  security_alerts: {
    failed_login_attempts: number
    suspicious_activities: number
    blocked_ips: number
  }
  backup_status: {
    last_backup: string
    backup_size: string
    status: string
  }
}

interface SystemHealth {
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  database_connections: number
  queue_jobs: {
    pending: number
    processing: number
    completed: number
  }
  cache_hit_rate: number
}

interface UserManagement {
  id: number
  name: string
  email: string
  role: string
  department: string
  documents_count: number
  reviews_count: number
  created_at: string
  last_login: string
  status: string
}

interface AuditLog {
  id: number
  action: string
  user: string
  document: string | null
  timestamp: string
  ip_address: string
  details: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [systemMonitoring, setSystemMonitoring] = useState<SystemMonitoring | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [userManagement, setUserManagement] = useState<UserManagement[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadUserData()
    loadDashboardData()
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

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load all dashboard data in parallel
      const [statsResponse, monitoringResponse, healthResponse, usersResponse, logsResponse] = await Promise.all([
        apiClient.getAdminStats(),
        apiClient.getAdminSystemMonitoring(),
        apiClient.getAdminSystemHealth(),
        apiClient.getAdminUserManagement(),
        apiClient.getAdminAuditLogs()
      ])

      if (statsResponse.success) {
        setStats(statsResponse.data)
      }

      if (monitoringResponse.success) {
        setSystemMonitoring(monitoringResponse.data)
      }

      if (healthResponse.success) {
        setSystemHealth(healthResponse.data)
      }

      if (usersResponse.success) {
        setUserManagement(usersResponse.data)
      }

      if (logsResponse.success) {
        setAuditLogs(logsResponse.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
      case "Healthy":
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "Failed":
      case "Error":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "Warning":
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Admin Dashboard"
        subtitle="System Administration & Management"
        backUrl="/"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.total_users.toLocaleString()}</div>
                <p className="text-xs text-gray-600">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{stats.active_sessions}</div>
                <p className="text-xs text-gray-600">+5% from yesterday</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.total_documents.toLocaleString()}</div>
                <p className="text-xs text-gray-600">+8% from last week</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">System Health</CardTitle>
                <Shield className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.system_health}</div>
                <p className="text-xs text-gray-600">All systems operational</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("monitoring")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "monitoring"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                System Monitoring
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "logs"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Audit Logs
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* System Health Metrics */}
            {systemHealth && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    System Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Cpu className="h-6 w-6 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">CPU Usage</span>
                      </div>
                      <p className={`text-2xl font-bold ${getHealthColor(systemHealth.cpu_usage)}`}>
                        {systemHealth.cpu_usage}%
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <MemoryStick className="h-6 w-6 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Memory Usage</span>
                      </div>
                      <p className={`text-2xl font-bold ${getHealthColor(systemHealth.memory_usage)}`}>
                        {systemHealth.memory_usage}%
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <HardDrive className="h-6 w-6 text-orange-600 mr-2" />
                        <span className="text-sm font-medium">Disk Usage</span>
                      </div>
                      <p className={`text-2xl font-bold ${getHealthColor(systemHealth.disk_usage)}`}>
                        {systemHealth.disk_usage}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Storage Usage */}
            {stats && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-2" />
                    Storage Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Used Space</span>
                      <span className="text-sm text-gray-600">{stats.storage_usage.used}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stats.storage_usage.usage_percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Available: {stats.storage_usage.available}</span>
                      <span>Total: {stats.storage_usage.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Alerts */}
            {systemMonitoring && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{systemMonitoring.security_alerts.failed_login_attempts}</p>
                      <p className="text-sm text-gray-600">Failed Logins</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{systemMonitoring.security_alerts.suspicious_activities}</p>
                      <p className="text-sm text-gray-600">Suspicious Activities</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{systemMonitoring.security_alerts.blocked_ips}</p>
                      <p className="text-sm text-gray-600">Blocked IPs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "monitoring" && systemMonitoring && (
          <div className="space-y-6">
            {/* Database Status */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <div className="flex items-center mt-1">
                      {getStatusBadge(systemMonitoring.database_status.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connections</p>
                    <p className="text-lg font-semibold">{systemMonitoring.database_status.connections}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Response Time</p>
                    <p className="text-lg font-semibold">{systemMonitoring.database_status.response_time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Performance */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  API Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <p className="text-lg font-semibold">{systemMonitoring.api_performance.average_response_time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Requests/Min</p>
                    <p className="text-lg font-semibold">{systemMonitoring.api_performance.requests_per_minute}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Error Rate</p>
                    <p className="text-lg font-semibold">{systemMonitoring.api_performance.error_rate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Logs */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Error Logs (Today)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{systemMonitoring.error_logs.critical_errors}</p>
                    <p className="text-sm text-gray-600">Critical</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{systemMonitoring.error_logs.warning_errors}</p>
                    <p className="text-sm text-gray-600">Warnings</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{systemMonitoring.error_logs.total_errors_today}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>System users and their activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userManagement.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{user.role}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.documents_count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.last_login}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "logs" && (
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>System activity and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {log.action} by {log.user}
                      </p>
                      {log.document && (
                        <p className="text-sm text-gray-600">Document: {log.document}</p>
                      )}
                      <p className="text-sm text-gray-500">{log.details}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-400">{log.timestamp}</p>
                        <p className="text-xs text-gray-400">IP: {log.ip_address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
