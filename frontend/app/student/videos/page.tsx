"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Video, Play, Clock, Eye, Filter, BookOpen } from "lucide-react"
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

interface VideoContent {
  id: number
  title: string
  instructor: string
  course: string
  duration: string
  views: number
  uploadDate: string
  category: string
  thumbnail: string
  description: string
}

export default function VideoLibraryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("")
  const [videos, setVideos] = useState<VideoContent[]>([])
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
    
    loadVideos()
  }, [])

  useEffect(() => {
    loadVideos()
  }, [searchQuery, selectedCategory, selectedDuration])

  const loadVideos = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchQuery) params.search_query = searchQuery
      if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory
      if (selectedDuration && selectedDuration !== "all") params.duration = selectedDuration

      const response = await apiClient.getVideos(params)
      
      if (response.success && response.data) {
        setVideos(response.data)
      }
    } catch (error) {
      console.error('Error loading videos:', error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewVideo = async (videoId: number) => {
    try {
      await apiClient.previewDocument(videoId)
      console.log('Video preview opened:', videoId)
    } catch (error) {
      console.error('Error previewing video:', error)
      toast.error('Failed to preview video')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Video Library"
        subtitle="Educational content and lectures"
        backUrl="/student/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5  text-red-600" />
              Search & Filter Videos
            </CardTitle>
            <CardDescription>Find educational content by topic, instructor, or course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search videos by title, instructor, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="lab-session">Lab Session</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Duration</SelectItem>
                  <SelectItem value="short">Short (&lt; 15 min)</SelectItem>
                  <SelectItem value="medium">Medium (15-45 min)</SelectItem>
                  <SelectItem value="long">Long (&gt; 45 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? "Loading..." : `${videos.length} video${videos.length !== 1 ? "s" : ""} found`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading videos...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <Button size="sm" variant="secondary" className="opacity-90">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                        <p className="text-gray-600 mb-3">{video.description}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {video.course}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {video.uploadDate}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {video.views} views
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Badge variant="secondary">{video.category}</Badge>
                          <span className="text-sm text-gray-600">by {video.instructor}</span>
                        </div>

                        <Button onClick={() => handleViewVideo(video.id)}>
                          <Play className="h-4 w-4 " />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
