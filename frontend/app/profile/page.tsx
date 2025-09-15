"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Building2,
  Edit,
  Camera,
  Download,
  Upload,
  Eye,
  Star,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Target,
  Activity,
  Settings,
  Share2,
  Bell,
  MessageCircle
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
  avatar?: string
  phone?: string
  address?: string
  date_of_birth?: string
  bio?: string
  joined_date?: string
  last_active?: string
}

interface UserStats {
  documents_accessed: number
  downloads: number
  bookmarks: number
  study_hours: number
  achievements: number
  study_groups_joined: number
  exams_taken: number
  average_rating: number
}

interface Activity {
  id: number
  type: string
  description: string
  timestamp: string
  document_title?: string
  course_name?: string
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  earned_date: string
  category: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setLoading(true)
    try {
      // Load user info from localStorage
      const userInfo = localStorage.getItem('user_info')
      if (userInfo) {
        const userData = JSON.parse(userInfo)
        setUser(userData)
      }

      // Load additional profile data from API
      const [statsResponse, activityResponse, achievementsResponse] = await Promise.all([
        apiClient.getUserStats(),
        apiClient.getUserActivity(),
        apiClient.getUserAchievements()
      ])

      if (statsResponse.success && statsResponse.data) {
        setUserStats(statsResponse.data)
      }

      if (activityResponse.success && activityResponse.data) {
        setRecentActivity(activityResponse.data)
      }

      if (achievementsResponse.success && achievementsResponse.data) {
        setAchievements(achievementsResponse.data)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    window.location.href = '/settings'
  }

  const handleShareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user?.name}'s Profile`,
          text: `Check out ${user?.name}'s academic profile on AASTU Archive`,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Profile link copied to clipboard')
      }
    } catch (error) {
      console.error('Error sharing profile:', error)
      toast.error('Failed to share profile')
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student'
      case 'teacher':
        return 'Teacher'
      case 'department_head':
        return 'Department Head'
      case 'college_dean':
        return 'College Dean'
      case 'admin':
        return 'Administrator'
      default:
        return 'User'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800'
      case 'teacher':
        return 'bg-green-100 text-green-800'
      case 'department_head':
        return 'bg-purple-100 text-purple-800'
      case 'college_dean':
        return 'bg-orange-100 text-orange-800'
      case 'admin':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_view':
        return <Eye className="h-4 w-4 text-blue-500" />
      case 'document_download':
        return <Download className="h-4 w-4 text-green-500" />
      case 'bookmark_added':
        return <BookOpen className="h-4 w-4 text-yellow-500" />
      case 'exam_taken':
        return <Target className="h-4 w-4 text-red-500" />
      case 'study_group_joined':
        return <User className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'star':
        return <Star className="h-6 w-6 text-yellow-500" />
      case 'trophy':
        return <Award className="h-6 w-6 text-orange-500" />
      case 'book':
        return <BookOpen className="h-6 w-6 text-blue-500" />
      case 'target':
        return <Target className="h-6 w-6 text-red-500" />
      default:
        return <Award className="h-6 w-6 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h1>
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={getRoleColor(user?.role || 'user')}>
                        {getRoleDisplayName(user?.role || 'user')}
                      </Badge>
                      {user?.department && (
                        <Badge variant="outline">
                          <Building2 className="h-3 w-3 mr-1" />
                          {user.department}
                        </Badge>
                      )}
                    </div>
                    {user?.bio && (
                      <p className="text-gray-600 max-w-2xl">{user.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleEditProfile}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={handleShareProfile}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email || 'No email provided'}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.address}</span>
                    </div>
                  )}
                  {user?.date_of_birth && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Born {new Date(user.date_of_birth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Join Date and Last Active */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {user?.joined_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.joined_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {user?.last_active && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Last active {new Date(user.last_active).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Statistics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            {userStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{userStats.documents_accessed}</div>
                    <div className="text-sm text-gray-500">Documents Accessed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{userStats.downloads}</div>
                    <div className="text-sm text-gray-500">Downloads</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{userStats.bookmarks}</div>
                    <div className="text-sm text-gray-500">Bookmarks</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{userStats.study_hours}</div>
                    <div className="text-sm text-gray-500">Study Hours</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Your latest interactions with the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setActiveTab('activity')}>
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Activity Timeline</span>
                </CardTitle>
                <CardDescription>Complete history of your platform interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        {activity.document_title && (
                          <p className="text-sm text-blue-600 mt-1">{activity.document_title}</p>
                        )}
                        {activity.course_name && (
                          <p className="text-sm text-green-600 mt-1">{activity.course_name}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      {getAchievementIcon(achievement.icon)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge variant="outline">{achievement.category}</Badge>
                      <span>{new Date(achievement.earned_date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {achievements.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
                  <p className="text-gray-500">Keep using the platform to earn achievements!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {userStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Documents Accessed</span>
                      <span className="font-semibold">{userStats.documents_accessed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Downloads</span>
                      <span className="font-semibold">{userStats.downloads}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bookmarks</span>
                      <span className="font-semibold">{userStats.bookmarks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Study Hours</span>
                      <span className="font-semibold">{userStats.study_hours}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Study Groups Joined</span>
                      <span className="font-semibold">{userStats.study_groups_joined}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Exams Taken</span>
                      <span className="font-semibold">{userStats.exams_taken}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{userStats.average_rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Achievements</span>
                      <span className="font-semibold">{userStats.achievements}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

