"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lightbulb, Star, TrendingUp, Clock, Download, Eye, BookOpen } from "lucide-react"
import Link from "next/link"
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
  student_id?: string
  department_id?: number
}

interface Suggestion {
  id: number
  title: string
  author: string
  department: string
  relevance: number
  reason: string
  type: string
  downloads: number
  rating: number
}

export default function SuggestionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
    
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getSuggestions()
      
      if (response.success && response.data) {
        setSuggestions(response.data)
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDocument = async (documentId: number) => {
    try {
      await apiClient.previewDocument(documentId)
      console.log('Document preview opened:', documentId)
    } catch (error) {
      console.error('Error previewing document:', error)
      toast.error('Failed to preview document')
    }
  }

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await apiClient.downloadDocument(documentId)
      console.log('Document download started:', documentId)
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Failed to download document')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Header */}
      <PageHeader
        title="Document Suggestions"
        subtitle="AI-powered recommendations for AASTU Digital Repository"
        backUrl="/student/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-8 w-8 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-blue-800 bg-clip-text text-transparent">Recommended for You</h2>
            </div>
            <p className="text-gray-700">
              Based on your academic interests, search history, and trending content in your field.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading personalized suggestions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-lg transition-all duration-300 shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-amber-100 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{suggestion.title}</h3>
                        <div className="flex items-center ml-4">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{suggestion.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>By {suggestion.author}</span>
                        <span>•</span>
                        <span>{suggestion.department}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">{suggestion.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1 text-blue-600" />
                          {suggestion.downloads} downloads
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 text-amber-600" />
                          {suggestion.relevance}% relevance
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{suggestion.reason}</p>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button size="sm" onClick={() => handleViewDocument(suggestion.id)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(suggestion.id)} className="border-amber-200 text-amber-800 hover:bg-amber-50 hover:border-amber-300 rounded-xl">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl">
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions available</h3>
              <p className="text-gray-500">
                Start browsing documents to get personalized recommendations.
              </p>
              <Link href="/student/browse">
                <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Documents
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
