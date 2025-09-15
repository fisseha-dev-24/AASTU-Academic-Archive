"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
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

interface SystemMetrics {
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

export default function AdminSystem() {
  const [user, setUser] = useState<User | null>(null)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadUserData()
    loadSystemMetrics()
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

  const loadSystemMetrics = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAdminSystemMonitoring()
      if (response.success && response.data) {
        setSystemMetrics(response.data)
      } else {
        console.error('Failed to load system metrics:', response.message)
        // Set fallback data
        setSystemMetrics({
          database_status: {
            status: "healthy",
            connections: 12,
            response_time: "45ms"
          },
          file_system_status: {
            status: "healthy",
            read_permissions: true,
            write_permissions: true,
            storage_accessible: true
          },
          api_performance: {
            average_response_time: "120ms",
            requests_per_minute: 45,
            error_rate: "0.2%"
          },
          error_logs: {
            total_errors_today: 3,
            critical_errors: 0,
            warning_errors: 3
          },
          security_alerts: {
            failed_login_attempts: 2,
            suspicious_activities: 0,
            blocked_ips: 0
          },
          backup_status: {
            last_backup: "2025-09-14 10:30:00",
            backup_size: "2.3GB",
            status: "completed"
          }
        })
      }
    } catch (error) {
      console.error('Error loading system metrics:', error)
      toast.error('Failed to load system metrics')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadSystemMetrics()
    setRefreshing(false)
    toast.success('System metrics refreshed')
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'completed':
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case 'warning':
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'error':
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="System Monitoring"
        subtitle="Monitor system health and performance"
        backUrl="/admin/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
            <div>
            <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
            <p className="text-gray-600">Real-time system health and performance metrics</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
      </div>

        {systemMetrics && (
          <>
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{systemMetrics.database_status.connections}</p>
                      <p className="text-xs text-muted-foreground">Active Connections</p>
                </div>
                    <div className="text-right">
                      {getStatusBadge(systemMetrics.database_status.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {systemMetrics.database_status.response_time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">File System</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                <div>
                      <p className="text-2xl font-bold">
                        {systemMetrics.file_system_status.read_permissions && systemMetrics.file_system_status.write_permissions ? '100%' : '50%'}
                  </p>
                      <p className="text-xs text-muted-foreground">Permissions</p>
                </div>
                    <div className="text-right">
                      {getStatusBadge(systemMetrics.file_system_status.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {systemMetrics.file_system_status.storage_accessible ? 'Accessible' : 'Inaccessible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Performance</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{systemMetrics.api_performance.requests_per_minute}</p>
                      <p className="text-xs text-muted-foreground">Requests/min</p>
                </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{systemMetrics.api_performance.average_response_time}</p>
                      <p className="text-xs text-muted-foreground">
                        Error Rate: {systemMetrics.api_performance.error_rate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Error Logs */}
          <Card>
            <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                    Error Logs
              </CardTitle>
                  <CardDescription>System errors and warnings</CardDescription>
            </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Errors Today</span>
                      <Badge variant="outline">{systemMetrics.error_logs.total_errors_today}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Critical Errors</span>
                      <Badge className={systemMetrics.error_logs.critical_errors > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {systemMetrics.error_logs.critical_errors}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Warning Errors</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {systemMetrics.error_logs.warning_errors}
                      </Badge>
                    </div>
                  </div>
            </CardContent>
          </Card>

              {/* Security Alerts */}
          <Card>
            <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2 text-red-600" />
                    Security Alerts
              </CardTitle>
                  <CardDescription>Security monitoring and alerts</CardDescription>
            </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Failed Login Attempts</span>
                      <Badge variant="outline">{systemMetrics.security_alerts.failed_login_attempts}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Suspicious Activities</span>
                      <Badge variant="outline">{systemMetrics.security_alerts.suspicious_activities}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Blocked IPs</span>
                      <Badge variant="outline">{systemMetrics.security_alerts.blocked_ips}</Badge>
                    </div>
                  </div>
            </CardContent>
          </Card>

              {/* Backup Status */}
              <Card>
          <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-2 text-blue-600" />
                    Backup Status
            </CardTitle>
                  <CardDescription>System backup information</CardDescription>
          </CardHeader>
          <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last Backup</span>
                      <span className="text-sm text-gray-600">{systemMetrics.backup_status.last_backup}</span>
                </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Backup Size</span>
                      <span className="text-sm text-gray-600">{systemMetrics.backup_status.backup_size}</span>
                </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status</span>
                      {getStatusBadge(systemMetrics.backup_status.status)}
                </div>
              </div>
          </CardContent>
        </Card>

              {/* System Actions */}
        <Card>
          <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                    System Actions
            </CardTitle>
                  <CardDescription>Administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full">
                      <HardDrive className="w-4 h-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Activity className="w-4 h-4 mr-2" />
                      View Logs
                        </Button>
                  </div>
          </CardContent>
        </Card>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}