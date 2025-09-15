"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  HardDrive,
  Download,
  Upload,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Database,
  FileText,
  Calendar,
  Shield,
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

interface Backup {
  id: number
  name: string
  type: 'full' | 'incremental' | 'differential'
  size: string
  created_at: string
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled'
  location: string
  description?: string
}

interface BackupSettings {
  auto_backup_enabled: boolean
  backup_frequency: 'daily' | 'weekly' | 'monthly'
  backup_time: string
  retention_days: number
  backup_location: string
  include_files: boolean
  include_database: boolean
  compression_enabled: boolean
}

export default function AdminBackups() {
  const [user, setUser] = useState<User | null>(null)
  const [backups, setBackups] = useState<Backup[]>([])
  const [backupSettings, setBackupSettings] = useState<BackupSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingBackup, setCreatingBackup] = useState(false)

  useEffect(() => {
    loadUserData()
    loadBackupData()
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

  const loadBackupData = async () => {
    try {
      setLoading(true)
      
      // Load real backup data from API
      const [backupsResponse, settingsResponse] = await Promise.all([
        apiClient.getAdminBackups(),
        apiClient.getBackupSettings()
      ])

      if (backupsResponse.success) {
        setBackups(backupsResponse.data || [])
      } else {
        console.error('Failed to load backups:', backupsResponse.message)
        setBackups([])
      }

      if (settingsResponse.success) {
        setBackupSettings(settingsResponse.data)
      } else {
        console.error('Failed to load backup settings:', settingsResponse.message)
        // Set default settings if API fails
        setBackupSettings({
          auto_backup_enabled: true,
          backup_frequency: 'monthly',
          backup_time: '02:00',
          retention_days: 90,
          backup_location: '/storage/app/backups',
          include_files: true,
          include_database: true,
          compression_enabled: true
        })
      }
    } catch (error) {
      console.error('Error loading backup data:', error)
      toast.error('Failed to load backup data')
      setBackups([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'full':
        return <Badge className="bg-purple-100 text-purple-800">Full</Badge>
      case 'incremental':
        return <Badge className="bg-blue-100 text-blue-800">Incremental</Badge>
      case 'differential':
        return <Badge className="bg-orange-100 text-orange-800">Differential</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const handleCreateBackup = async (type: 'full' | 'incremental' | 'differential') => {
    try {
      setCreatingBackup(true)
      const response = await apiClient.createBackup(type)
      
      if (response.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} backup created successfully`)
        loadBackupData() // Reload backup list
      } else {
        toast.error(response.message || 'Failed to create backup')
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      toast.error('Failed to create backup')
    } finally {
      setCreatingBackup(false)
    }
  }

  const handleDownloadBackup = async (backup: Backup) => {
    try {
      await apiClient.downloadBackup(backup.location)
      toast.success(`Downloading ${backup.name}...`)
    } catch (error) {
      console.error('Error downloading backup:', error)
      toast.error('Failed to download backup')
    }
  }

  const handleDeleteBackup = async (backup: Backup) => {
    if (!confirm('Are you sure you want to delete this backup? This action cannot be undone.')) return
    
    try {
      const response = await apiClient.deleteBackup(backup.location)
      
      if (response.success) {
        toast.success('Backup deleted successfully')
        loadBackupData() // Reload backup list
      } else {
        toast.error(response.message || 'Failed to delete backup')
      }
    } catch (error) {
      console.error('Error deleting backup:', error)
      toast.error('Failed to delete backup')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading backup data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Backup Management"
        subtitle="Manage system backups and recovery"
        backUrl="/admin/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backup Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <HardDrive className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Backups</p>
                  <p className="text-2xl font-bold text-blue-600">{backups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600">
                    {backups.filter(b => b.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {backups.filter(b => b.status === 'failed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold text-purple-600">2.5 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Backup Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Backup Actions
                </CardTitle>
                <CardDescription>Create new backups and manage settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleCreateBackup('full')}
                  disabled={creatingBackup}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  {creatingBackup ? 'Creating...' : 'Create Full Backup'}
                </Button>
                
                <Button
                  onClick={() => handleCreateBackup('incremental')}
                  disabled={creatingBackup}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {creatingBackup ? 'Creating...' : 'Create Incremental'}
                </Button>
                
                <Button
                  onClick={() => handleCreateBackup('differential')}
                  disabled={creatingBackup}
                  variant="outline"
                  className="w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {creatingBackup ? 'Creating...' : 'Database Only'}
                </Button>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Backup Settings</h4>
                  {backupSettings && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Auto Backup:</span>
                        <Badge className={backupSettings.auto_backup_enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {backupSettings.auto_backup_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Frequency:</span>
                        <span className="capitalize">{backupSettings.backup_frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{backupSettings.backup_time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retention:</span>
                        <span>{backupSettings.retention_days} days</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backup List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Backup History
                </CardTitle>
                <CardDescription>View and manage existing backups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{backup.name}</h4>
                            {getTypeBadge(backup.type)}
                            {getStatusBadge(backup.status)}
                          </div>
                          {backup.description && (
                            <p className="text-sm text-gray-600 mb-2">{backup.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {backup.created_at}
                            </div>
                            <div className="flex items-center">
                              <HardDrive className="w-4 h-4 mr-1" />
                              {backup.size}
                            </div>
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-1" />
                              {backup.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {backup.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadBackup(backup)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBackup(backup)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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
