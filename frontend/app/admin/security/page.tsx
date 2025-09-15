"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Globe,
  Server,
  Database,
  Activity,
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

interface SecuritySettings {
  password_policy: {
    min_length: number
    require_uppercase: boolean
    require_lowercase: boolean
    require_numbers: boolean
    require_symbols: boolean
    password_expiry_days: number
  }
  session_settings: {
    session_timeout_minutes: number
    max_concurrent_sessions: number
    require_2fa: boolean
  }
  access_control: {
    ip_whitelist_enabled: boolean
    allowed_ips: string[]
    blocked_ips: string[]
  }
  audit_settings: {
    log_all_actions: boolean
    log_failed_attempts: boolean
    retention_days: number
  }
}

interface SecurityAlert {
  id: number
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  resolved: boolean
}

export default function AdminSecurity() {
  const [user, setUser] = useState<User | null>(null)
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null)
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
    loadSecurityData()
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

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      // Mock data for now - in real implementation, this would come from API
      setSecuritySettings({
        password_policy: {
          min_length: 8,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_symbols: false,
          password_expiry_days: 90
        },
        session_settings: {
          session_timeout_minutes: 30,
          max_concurrent_sessions: 3,
          require_2fa: false
        },
        access_control: {
          ip_whitelist_enabled: false,
          allowed_ips: ['192.168.1.0/24', '10.0.0.0/8'],
          blocked_ips: ['192.168.1.100']
        },
        audit_settings: {
          log_all_actions: true,
          log_failed_attempts: true,
          retention_days: 365
        }
      })

      setSecurityAlerts([
        {
          id: 1,
          type: 'Failed Login',
          severity: 'medium',
          message: 'Multiple failed login attempts from IP 192.168.1.100',
          timestamp: '2025-09-14 10:30:00',
          resolved: false
        },
        {
          id: 2,
          type: 'Suspicious Activity',
          severity: 'high',
          message: 'Unusual document access pattern detected',
          timestamp: '2025-09-14 09:15:00',
          resolved: true
        },
        {
          id: 3,
          type: 'Password Policy',
          severity: 'low',
          message: 'User password expired and needs renewal',
          timestamp: '2025-09-14 08:45:00',
          resolved: false
        }
      ])
    } catch (error) {
      console.error('Error loading security data:', error)
      toast.error('Failed to load security data')
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

  const handleSettingChange = (section: string, setting: string, value: any) => {
    if (securitySettings) {
      setSecuritySettings({
        ...securitySettings,
        [section]: {
          ...securitySettings[section as keyof SecuritySettings],
          [setting]: value
        }
      })
    }
  }

  const handleSaveSettings = async () => {
    try {
      // In real implementation, this would save to backend
      toast.success('Security settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save security settings')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading security settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Security Settings"
        subtitle="Manage system security and access controls"
        backUrl="/admin/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-2xl font-bold text-green-600">Secure</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {securityAlerts.filter(alert => !alert.resolved).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Lock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Blocked IPs</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {securitySettings?.access_control.blocked_ips.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Password Policy
                </CardTitle>
                <CardDescription>Configure password requirements and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securitySettings && (
                  <>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Minimum Length</label>
                      <Input
                        type="number"
                        value={securitySettings.password_policy.min_length}
                        onChange={(e) => handleSettingChange('password_policy', 'min_length', parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Require Uppercase</label>
                      <Switch
                        checked={securitySettings.password_policy.require_uppercase}
                        onCheckedChange={(checked) => handleSettingChange('password_policy', 'require_uppercase', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Require Numbers</label>
                      <Switch
                        checked={securitySettings.password_policy.require_numbers}
                        onCheckedChange={(checked) => handleSettingChange('password_policy', 'require_numbers', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Password Expiry (days)</label>
                      <Input
                        type="number"
                        value={securitySettings.password_policy.password_expiry_days}
                        onChange={(e) => handleSettingChange('password_policy', 'password_expiry_days', parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Session Settings
                </CardTitle>
                <CardDescription>Configure user session management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securitySettings && (
                  <>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Session Timeout (minutes)</label>
                      <Input
                        type="number"
                        value={securitySettings.session_settings.session_timeout_minutes}
                        onChange={(e) => handleSettingChange('session_settings', 'session_timeout_minutes', parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Max Concurrent Sessions</label>
                      <Input
                        type="number"
                        value={securitySettings.session_settings.max_concurrent_sessions}
                        onChange={(e) => handleSettingChange('session_settings', 'max_concurrent_sessions', parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Require 2FA</label>
                      <Switch
                        checked={securitySettings.session_settings.require_2fa}
                        onCheckedChange={(checked) => handleSettingChange('session_settings', 'require_2fa', checked)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Access Control
                </CardTitle>
                <CardDescription>Manage IP whitelist and access restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securitySettings && (
                  <>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">IP Whitelist Enabled</label>
                      <Switch
                        checked={securitySettings.access_control.ip_whitelist_enabled}
                        onCheckedChange={(checked) => handleSettingChange('access_control', 'ip_whitelist_enabled', checked)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Allowed IPs</label>
                      <div className="mt-2 space-y-2">
                        {securitySettings.access_control.allowed_ips.map((ip, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input value={ip} readOnly className="flex-1" />
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm">Add IP</Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Button onClick={handleSaveSettings} className="w-full bg-blue-600 hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Save Security Settings
            </Button>
          </div>

          {/* Security Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Security Alerts
                </CardTitle>
                <CardDescription>Recent security events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      alert.resolved ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-sm">{alert.type}</span>
                            {getSeverityBadge(alert.severity)}
                            {alert.resolved && (
                              <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.timestamp}</p>
                        </div>
                        {!alert.resolved && (
                          <Button variant="outline" size="sm">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Security Actions
                </CardTitle>
                <CardDescription>Quick security actions and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Run Security Scan
                  </Button>
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    View Active Sessions
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Export Audit Logs
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Server className="w-4 h-4 mr-2" />
                    Block Suspicious IP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

