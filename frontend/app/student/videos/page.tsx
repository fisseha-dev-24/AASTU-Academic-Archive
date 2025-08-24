"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Video, Play, Clock, Eye, Filter, BookOpen } from "lucide-react"
import Link from "next/link"

export default function VideoLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("")

  const videos = [
    {
      id: 1,
      title: "Introduction to Software Architecture",
      instructor: "Dr. Sarah Johnson",
      course: "SE 301",
      duration: "45:30",
      views: 1234,
      uploadDate: "2024-01-15",
      category: "Lecture",
      thumbnail: "/software-architecture-lecture.png",
      description: "Comprehensive overview of software architecture patterns and principles",
    },
    {
      id: 2,
      title: "Database Normalization Tutorial",
      instructor: "Prof. Michael Chen",
      course: "CS 205",
      duration: "32:15",
      views: 856,
      uploadDate: "2024-01-12",
      category: "Tutorial",
      thumbnail: "/database-normalization-tutorial.png",
      description: "Step-by-step guide to database normalization techniques",
    },
    {
      id: 3,
      title: "Machine Learning Lab Session",
      instructor: "Dr. Emily Davis",
      course: "CS 401",
      duration: "1:15:20",
      views: 642,
      uploadDate: "2024-01-10",
      category: "Lab Session",
      thumbnail: "/machine-learning-lab-session.png",
      description: "Hands-on implementation of machine learning algorithms",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Video Library</h1>
                <p className="text-sm text-gray-600">Educational videos and lecture recordings</p>
              </div>
            </div>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-red-600" />
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
                  <SelectItem value="lecture">Lectures</SelectItem>
                  <SelectItem value="tutorial">Tutorials</SelectItem>
                  <SelectItem value="lab">Lab Sessions</SelectItem>
                  <SelectItem value="seminar">Seminars</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Under 30 min</SelectItem>
                  <SelectItem value="medium">30-60 min</SelectItem>
                  <SelectItem value="long">Over 60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {videos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="lg" className="rounded-full">
                    <Play className="h-6 w-6 mr-2" />
                    Play Video
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-2">By {video.instructor}</p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{video.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{video.category}</Badge>
                  <span className="text-xs text-gray-500">{video.course}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {video.views} views
                  </div>
                  <span>{video.uploadDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Categories */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Lectures</h4>
                <p className="text-sm text-gray-500">45 videos</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Play className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Tutorials</h4>
                <p className="text-sm text-gray-500">32 videos</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Video className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Lab Sessions</h4>
                <p className="text-sm text-gray-500">28 videos</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Seminars</h4>
                <p className="text-sm text-gray-500">15 videos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
