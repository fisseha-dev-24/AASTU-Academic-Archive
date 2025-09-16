"use client"

"use client"

"use client"

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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
  Star,
  Zap,
  Crown,
  Globe,
  Award,
  Target,
  TrendingUp,
  Eye,
  Download,
  Upload,
  Lock,
  Key,
  Wifi,
  WifiOff,
  Clock,
  BarChart3,
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
  department?: string | { name: string }
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
  status: string
  department?: string
  last_login?: string
  created_at: string
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
  const [updatingUser, setUpdatingUser] = useState<number | null>(null)
  const [welcomeMessage, setWelcomeMessage] = useState("")

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

        // Set welcome message
        const hour = new Date().getHours()
        let greeting = ""
        if (hour < 12) greeting = "Good morning"
        else if (hour < 18) greeting = "Good afternoon"
        else greeting = "Good evening"

        const firstName = userData.name ? userData.name.split(' ')[0] : 'Admin'
        setWelcomeMessage(`${greeting}, ${firstName}!`)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
  }

  const loadDashboardData = async () => {
    try {
      const response = await apiClient.getAdminStats()
      if (response.success && response.data) {
        setStats(response.data)
      }

      // Load system monitoring
      try {
        const monitoringResponse = await apiClient.getAdminSystemMonitoring()
        if (monitoringResponse.success) {
          setSystemMonitoring(monitoringResponse.data)
        }
      } catch (error) {
        console.error('Error loading system monitoring:', error)
        // Set fallback data
        setSystemMonitoring({
          database_status: {
            status: "unknown",
            connections: 0,
            response_time: "0ms"
          },
          file_system_status: {
            status: "unknown",
            read_permissions: false,
            write_permissions: false,
            storage_accessible: false
          },
          api_performance: {
            average_response_time: "0ms",
            requests_per_minute: 0,
            error_rate: "0%"
          },
          error_logs: {
            total_errors_today: 0,
            critical_errors: 0,
            warning_errors: 0
          },
          security_alerts: {
            failed_login_attempts: 0,
            suspicious_activities: 0,
            blocked_ips: 0
          },
          backup_status: {
            last_backup: "",
            backup_size: "0GB",
            status: "unknown"
          }
        })
      }

      // Load system health
      try {
        const healthResponse = await apiClient.getAdminSystemHealth()
        if (healthResponse.success) {
          setSystemHealth(healthResponse.data)
        } else {
          setSystemHealth({
            cpu_usage: 0,
            memory_usage: 0,
            disk_usage: 0,
            database_connections: 0,
            queue_jobs: {
              pending: 0,
              processing: 0,
              completed: 0
            },
            cache_hit_rate: 0
          })
        }
      } catch (error) {
        console.error('Error loading system health:', error)
        setSystemHealth({
          cpu_usage: 0,
          memory_usage: 0,
          disk_usage: 0,
          database_connections: 0,
          queue_jobs: {
            pending: 0,
            processing: 0,
            completed: 0
          },
          cache_hit_rate: 0
        })
      }

      // Load user management
      try {
        const userResponse = await apiClient.getAdminUserManagement()
        if (userResponse.success) {
          setUserManagement(userResponse.data)
        } else {
          setUserManagement([])
        }
      } catch (error) {
        console.error('Error loading user management:', error)
        setUserManagement([])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set empty stats on error
      setStats({
        total_users: 0,
        active_sessions: 0,
        total_documents: 0,
        system_health: "unknown",
        storage_usage: {
          total: "0GB",
          used: "0GB",
          available: "0GB",
          usage_percentage: 0
        },
        recent_logins: 0,
        failed_attempts: 0,
        system_uptime: "0 days, 0 hours"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusUpdate = async (userId: number, status: string) => {
    setUpdatingUser(userId)
    try {
      const response = await apiClient.updateUserStatus(userId, status)
      if (response.success) {
        toast.success(`User status updated to ${status}`)
        loadDashboardData() // Refresh data
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Error updating user status')
    } finally {
      setUpdatingUser(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
      case 'pending_verification':
        return <Badge className="bg-blue-100 text-blue-800">Pending Verification</Badge>
      case 'on_leave':
        return <Badge className="bg-purple-100 text-purple-800">On Leave</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getSystemHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getSystemHealthBg = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100'
      case 'good':
        return 'bg-blue-100'
      case 'fair':
        return 'bg-yellow-100'
      case 'poor':
        return 'bg-red-100'
      default:
        return 'bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Admin Dashboard"
        subtitle="System administration and monitoring"
        backUrl="/"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-600 font-medium">Welcome back, Administrator!</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {welcomeMessage}
                  </h1>
                  <p className="text-gray-600 max-w-2xl">
                    Monitor system health, manage users, and ensure optimal performance of the academic archive platform.
                  </p>
                  <div className="flex items-center space-x-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">System Administrator</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">System Health: {stats?.system_health}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats?.total_users?.toLocaleString() || 0}</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_users?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-500 mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.active_sessions || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Currently online</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_documents?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-500 mt-1">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
              <Monitor className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.system_health || 'Good'}</div>
              <p className="text-xs text-gray-500 mt-1">Uptime: {stats?.system_uptime || 'N/A'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">User Management</h3>
                      <p className="text-sm text-gray-500">Manage all users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/system">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Server className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">System Monitor</h3>
                      <p className="text-sm text-gray-500">Monitor system health</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/security">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Security</h3>
                      <p className="text-sm text-gray-500">Security settings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/backups">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Backups</h3>
                      <p className="text-sm text-gray-500">Manage backups</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/audit-logs">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Audit Logs</h3>
                      <p className="text-sm text-gray-500">System activity logs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Health */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-gray-600" />
                <span>System Health</span>
              </CardTitle>
              <CardDescription>Real-time system monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Cpu className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">CPU Usage</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{systemHealth.cpu_usage}%</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <MemoryStick className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Memory Usage</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{systemHealth.memory_usage}%</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <HardDrive className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">Disk Usage</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{systemHealth.disk_usage}%</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Database className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">DB Connections</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{systemHealth.database_connections}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Cache Hit Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{systemHealth.cache_hit_rate}%</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userManagement.slice(0, 5).map((user) => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="capitalize">{user.role.replace('_', ' ')}</span>
                        {user.department && (
                          <span className="ml-2">• {user.department}</span>
                        )}
                      </div>
                      <select
                        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                        value={user.status}
                        onChange={(e) => handleUserStatusUpdate(user.id, e.target.value)}
                        disabled={updatingUser === user.id}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending_verification">Pending Verification</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Monitoring */}
        <div className="mt-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-gray-600" />
                <span>System Monitoring</span>
              </CardTitle>
              <CardDescription>Real-time system status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemMonitoring && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Database className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Database</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={systemMonitoring.database_status.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {systemMonitoring.database_status.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Connections:</span>
                          <span className="font-semibold">{systemMonitoring.database_status.connections}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Time:</span>
                          <span className="font-semibold">{systemMonitoring.database_status.response_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <HardDrive className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">File System</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={systemMonitoring.file_system_status.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {systemMonitoring.file_system_status.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Read Access:</span>
                          <span className="font-semibold">{systemMonitoring.file_system_status.read_permissions ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Write Access:</span>
                          <span className="font-semibold">{systemMonitoring.file_system_status.write_permissions ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Network className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">API Performance</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Response:</span>
                          <span className="font-semibold">{systemMonitoring.api_performance.average_response_time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Requests/min:</span>
                          <span className="font-semibold">{systemMonitoring.api_performance.requests_per_minute}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Error Rate:</span>
                          <span className="font-semibold">{systemMonitoring.api_performance.error_rate}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
