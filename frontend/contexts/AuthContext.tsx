"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient, removeAuthToken } from '@/lib/api'
import { toast } from 'sonner'

export interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
  permissions: string[]
  status: 'active' | 'inactive' | 'suspended'
  last_login?: string
  created_at?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: any) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string | string[]) => boolean
  refreshUser: () => Promise<boolean>
  refreshToken: () => Promise<boolean>
  validateSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Permission definitions
export const PERMISSIONS = {
  // Document permissions
  DOCUMENT_VIEW: 'document:view',
  DOCUMENT_CREATE: 'document:create',
  DOCUMENT_EDIT: 'document:edit',
  DOCUMENT_DELETE: 'document:delete',
  DOCUMENT_APPROVE: 'document:approve',
  DOCUMENT_REJECT: 'document:reject',
  
  // User management permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_SUSPEND: 'user:suspend',
  
  // Department permissions
  DEPARTMENT_VIEW: 'department:view',
  DEPARTMENT_EDIT: 'department:edit',
  DEPARTMENT_MANAGE: 'department:manage',
  
  // System permissions
  SYSTEM_MONITOR: 'system:monitor',
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_BACKUP: 'system:backup',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Export permissions
  EXPORT_DATA: 'export:data',
  EXPORT_REPORTS: 'export:reports',
} as const

// Role-based permission mappings
const ROLE_PERMISSIONS: Record<string, string[]> = {
  student: [
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  teacher: [
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_EDIT,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.EXPORT_DATA,
  ],
  department_head: [
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_EDIT,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_APPROVE,
    PERMISSIONS.DOCUMENT_REJECT,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_EDIT,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_REPORTS,
  ],
  dean: [
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_EDIT,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_APPROVE,
    PERMISSIONS.DOCUMENT_REJECT,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_EDIT,
    PERMISSIONS.DEPARTMENT_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_REPORTS,
  ],
  admin: [
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_EDIT,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_APPROVE,
    PERMISSIONS.DOCUMENT_REJECT,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_SUSPEND,
    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_EDIT,
    PERMISSIONS.DEPARTMENT_MANAGE,
    PERMISSIONS.SYSTEM_MONITOR,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_REPORTS,
  ],
  it_manager: [
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_EDIT,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_APPROVE,
    PERMISSIONS.DOCUMENT_REJECT,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_SUSPEND,
    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_EDIT,
    PERMISSIONS.DEPARTMENT_MANAGE,
    PERMISSIONS.SYSTEM_MONITOR,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_REPORTS,
  ],
} as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  })

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, []) // Only run once on mount

  // Set up token refresh and visibility change listeners
  useEffect(() => {
    // Set up automatic token refresh every 14 minutes (tokens typically expire in 15 minutes)
    const refreshInterval = setInterval(async () => {
      if (authState.isAuthenticated && authState.token) {
        const success = await refreshToken()
        if (!success) {
          // If refresh fails, try to validate the current session
          const isValid = await validateSession()
          if (!isValid) {
            // Session is invalid, logout user
            clearAuth()
            toast.error('Session expired. Please login again.')
          }
        }
      }
    }, 14 * 60 * 1000) // 14 minutes

    // Set up visibility change listener for tab focus
    const handleVisibilityChange = () => {
      if (!document.hidden && authState.isAuthenticated && authState.token) {
        // Tab became visible, validate session
        validateSession().then(isValid => {
          if (!isValid) {
            clearAuth()
            toast.error('Session expired. Please login again.')
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(refreshInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [authState.isAuthenticated, authState.token])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const userInfo = localStorage.getItem('user_info')

      if (token && userInfo) {
        // Set loading state immediately
        setAuthState(prev => ({ ...prev, isLoading: true }))
        
        try {
          // Verify token is still valid
          const response = await apiClient.getUser()
          if (response.success && response.user) {
            const user = {
              ...response.user,
              permissions: getUserPermissions(response.user.role),
            }
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              token,
            })
          } else {
            // Token invalid, clear storage
            clearAuth()
          }
        } catch (error) {
          console.error('Token validation error:', error)
          // Don't clear auth immediately on network errors
          // Only clear if it's an authentication error
          if (error instanceof Error && error.message.includes('Authentication failed')) {
            clearAuth()
          } else {
            // For network errors, keep the user logged in but mark as stale
            setAuthState(prev => ({ ...prev, isLoading: false }))
          }
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const getUserPermissions = (role: string): string[] => {
    return ROLE_PERMISSIONS[role] || []
  }

  const clearAuth = () => {
    removeAuthToken()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    })
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await apiClient.login({ email, password })
      
      if (response.success && response.token && response.user) {
        const user = {
          ...response.user,
          permissions: getUserPermissions(response.user.role),
        }
        
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_info', JSON.stringify(user))
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          token: response.token,
        })
        
        toast.success('Login successful!')
        
        // Redirect to appropriate dashboard based on user role
        setTimeout(() => {
          switch (user.role) {
            case "student":
              window.location.href = "/student/dashboard"
              break
            case "teacher":
              window.location.href = "/teacher/dashboard"
              break
            case "department_head":
              window.location.href = "/department/dashboard"
              break
            case "dean":
            case "college_dean":
              window.location.href = "/dean/dashboard"
              break
            case "admin":
            case "it_manager":
              window.location.href = "/admin/dashboard"
              break
            default:
              window.location.href = "/student/dashboard"
          }
        }, 1000) // Small delay to show success message
        
        return true
      } else {
        toast.error(response.message || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await apiClient.register(userData)
      
      if (response.success) {
        toast.success('Registration successful! Please login.')
        return true
      } else {
        toast.error(response.message || 'Registration failed')
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const logout = () => {
    clearAuth()
    toast.success('Logged out successfully')
    // Redirect to login page
    window.location.href = '/login'
  }

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData }
      setAuthState(prev => ({ ...prev, user: updatedUser }))
      localStorage.setItem('user_info', JSON.stringify(updatedUser))
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false
    return authState.user.permissions.includes(permission)
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!authState.user) return false
    
    if (Array.isArray(role)) {
      return role.includes(authState.user.role)
    }
    
    return authState.user.role === role
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getUser()
      if (response.success && response.user) {
        const user = {
          ...response.user,
          permissions: getUserPermissions(response.user.role),
        }
        updateUser(user)
        return true
      }
      return false
    } catch (error) {
      console.error('Error refreshing user:', error)
      return false
    }
  }

  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('auth_token')
      if (!currentToken) return false

      const response = await apiClient.refreshToken()
      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token)
        setAuthState(prev => ({ ...prev, token: response.token || null }))
        return true
      }
      return false
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    }
  }

  const validateSession = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return false

      const response = await apiClient.getUser()
      if (response.success && response.user) {
        return true
      }
      return false
    } catch (error) {
      console.error('Session validation error:', error)
      return false
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    updateUser,
    hasPermission,
    hasRole,
    refreshUser,
    refreshToken,
    validateSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for checking permissions
export function usePermission(permission: string) {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

// Hook for checking roles
export function useRole(role: string | string[]) {
  const { hasRole } = useAuth()
  return hasRole(role)
}
