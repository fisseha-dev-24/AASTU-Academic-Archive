"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Video, 
  FileQuestion, 
  Users, 
  Search, 
  Filter,
  Download,
  Eye,
  Star,
  Clock,
  User,
  Calendar,
  TrendingUp,
  Award,
  Bookmark,
  Play,
  FileText,
  GraduationCap
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
}

interface StudyResource {
  id: number
  title: string
  description: string
  type: string
  department: string
  uploaded_by: string
  uploaded_at: string
  duration?: string
  views: number
  downloads: number
  rating: number
  tags: string[]
  is_bookmarked: boolean
  difficulty_level: string
  subject: string
}

interface StudyGroup {
  id: number
  name: string
  description: string
  subject: string
  members_count: number
  max_members: number
  created_by: string
  created_at: string
  next_meeting?: string
  is_joined: boolean
}

export default function StudyResourcesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [studyResources, setStudyResources] = useState<StudyResource[]>([])
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("resources")

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
    
    loadStudyData()
  }, [])

  const loadStudyData = async () => {
    setLoading(true)
    try {
      const [resourcesResponse, groupsResponse] = await Promise.all([
        apiClient.getStudyResources(),
        apiClient.getStudyGroups()
      ])
      
      if (resourcesResponse.success && resourcesResponse.data) {
        setStudyResources(resourcesResponse.data)
      }
      
      if (groupsResponse.success && groupsResponse.data) {
        setStudyGroups(groupsResponse.data)
      }
    } catch (error) {
      console.error('Error loading study data:', error)
      setStudyResources([])
      setStudyGroups([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewResource = async (resourceId: number) => {
    try {
      await apiClient.previewDocument(resourceId)
      toast.success('Resource opened for preview')
    } catch (error) {
      console.error('Error previewing resource:', error)
      toast.error('Failed to preview resource')
    }
  }

  const handleDownloadResource = async (resourceId: number) => {
    try {
      await apiClient.downloadDocument(resourceId)
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading resource:', error)
      toast.error('Failed to download resource')
    }
  }

  const handleBookmarkToggle = async (resourceId: number, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await apiClient.removeBookmark(resourceId)
        toast.success('Bookmark removed')
      } else {
        await apiClient.addBookmark(resourceId)
        toast.success('Bookmark added')
      }
      loadStudyData()
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast.error('Failed to update bookmark')
    }
  }

  const handleJoinStudyGroup = async (groupId: number) => {
    try {
      await apiClient.joinStudyGroup(groupId)
      toast.success('Joined study group')
      loadStudyData()
    } catch (error) {
      console.error('Error joining study group:', error)
      toast.error('Failed to join study group')
    }
  }

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'Video Lecture':
        return 'bg-red-100 text-red-800'
      case 'Study Guide':
        return 'bg-blue-100 text-blue-800'
      case 'Practice Exam':
        return 'bg-green-100 text-green-800'
      case 'Tutorial':
        return 'bg-purple-100 text-purple-800'
      case 'Reference Material':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Resources</h1>
          <p className="text-gray-600">Access comprehensive study materials and join study groups</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Study Resources</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Study Groups</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/student/videos">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="bg-red-50 p-3 rounded-xl group-hover:bg-red-100 transition-colors duration-200 mx-auto w-fit mb-3">
                      <Video className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Video Lectures</h3>
                    <p className="text-sm text-gray-600">Educational videos</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/student/exams">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors duration-200 mx-auto w-fit mb-3">
                      <FileQuestion className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Practice Exams</h3>
                    <p className="text-sm text-gray-600">Test your knowledge</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/student/study-groups">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors duration-200 mx-auto w-fit mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Study Groups</h3>
                    <p className="text-sm text-gray-600">Collaborate with peers</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/student/suggestions">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors duration-200 mx-auto w-fit mb-3">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
                    <p className="text-sm text-gray-600">Personalized recommendations</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Study Resources */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading study resources...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                            {resource.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {resource.description}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmarkToggle(resource.id, resource.is_bookmarked)}
                          className="ml-2 p-2"
                        >
                          <Bookmark 
                            className={`h-4 w-4 ${resource.is_bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Resource Type and Difficulty */}
                        <div className="flex items-center justify-between">
                          <Badge className={getResourceTypeColor(resource.type)}>
                            {resource.type}
                          </Badge>
                          <Badge className={getDifficultyColor(resource.difficulty_level)}>
                            {resource.difficulty_level}
                          </Badge>
                        </div>

                        {/* Subject and Rating */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{resource.subject}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{resource.rating}</span>
                          </div>
                        </div>

                        {/* Resource Info */}
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span className="truncate">{resource.uploaded_by}</span>
                            </div>
                            {resource.duration && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{resource.duration}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{resource.views} views</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              <span>{resource.downloads} downloads</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewResource(resource.id)}
                            className="flex-1"
                          >
                            {resource.type === 'Video Lecture' ? (
                              <Play className="h-4 w-4 mr-1" />
                            ) : (
                              <Eye className="h-4 w-4 mr-1" />
                            )}
                            {resource.type === 'Video Lecture' ? 'Play' : 'View'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownloadResource(resource.id)}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && studyResources.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No study resources available</h3>
                  <p className="text-gray-500 mb-4">Check back later for new study materials.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading study groups...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studyGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {group.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mb-3">
                            {group.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {group.subject}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Group Info */}
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>Created by {group.created_by}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{new Date(group.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{group.members_count}/{group.max_members} members</span>
                            </div>
                            {group.next_meeting && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Next: {new Date(group.next_meeting).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Members</span>
                            <span className="text-gray-900">{group.members_count}/{group.max_members}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(group.members_count / group.max_members) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          className="w-full"
                          variant={group.is_joined ? "outline" : "default"}
                          onClick={() => handleJoinStudyGroup(group.id)}
                          disabled={group.is_joined || group.members_count >= group.max_members}
                        >
                          {group.is_joined ? (
                            <>
                              <Award className="h-4 w-4 mr-2" />
                              Joined
                            </>
                          ) : group.members_count >= group.max_members ? (
                            "Full"
                          ) : (
                            <>
                              <Users className="h-4 w-4 mr-2" />
                              Join Group
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && studyGroups.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups available</h3>
                  <p className="text-gray-500 mb-4">Create or join study groups to collaborate with your peers.</p>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Create Study Group
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

