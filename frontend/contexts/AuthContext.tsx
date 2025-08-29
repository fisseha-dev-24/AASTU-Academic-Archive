"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient, getAuthToken, removeAuthToken } from '@/lib/api'

interface User {
  id: number
  name: string
  email: string
  role: string
  student_id?: string
  department_id?: number
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken()
      const userInfo = localStorage.getItem('user_info')
      
      if (token && userInfo) {
        try {
          const userData = JSON.parse(userInfo)
          setUser(userData)
          
          // Verify token is still valid by making a test request
          try {
            await apiClient.request('/test-auth', { method: 'GET' })
          } catch (error) {
            // Token is invalid, clear session
            console.log('Token expired, clearing session')
            logout()
          }
        } catch (error) {
          console.error('Error parsing user info:', error)
          logout()
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_info', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
  }

  const refreshUser = async () => {
    const token = getAuthToken()
    if (token) {
      try {
        const response = await apiClient.request('/user/profile', { method: 'GET' })
        if (response.success && response.data) {
          setUser(response.data)
          localStorage.setItem('user_info', JSON.stringify(response.data))
        }
      } catch (error) {
        console.error('Error refreshing user data:', error)
      }
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser
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
