"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Search, Plus, MessageCircle, Calendar, Clock, UserPlus } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import PageHeader from "@/components/PageHeader"
import Footer from "@/components/Footer"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  student_id?: string
  department_id?: number
}

interface StudyGroup {
  id: number
  name: string
  course: string
  members: number
  maxMembers: number
  description: string
  nextMeeting: string
  location: string
  tags: string[]
  isJoined: boolean
}

export default function StudyGroupsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
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
    
    loadStudyGroups()
  }, [searchQuery])

  const loadStudyGroups = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchQuery) params.search_query = searchQuery

      const response = await apiClient.getStudyGroups(params)
      
      if (response.success && response.data) {
        setStudyGroups(response.data)
      }
    } catch (error) {
      console.error('Error loading study groups:', error)
      setStudyGroups([])
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async (groupId: number) => {
    try {
      // API call to join group
      console.log('Joining group:', groupId)
      // Refresh the list after joining
      loadStudyGroups()
    } catch (error) {
      console.error('Error joining group:', error)
    }
  }

  const handleLeaveGroup = async (groupId: number) => {
    try {
      // API call to leave group
      console.log('Leaving group:', groupId)
      // Refresh the list after leaving
      loadStudyGroups()
    } catch (error) {
      console.error('Error leaving group:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Study Groups"
        subtitle="Collaborative learning spaces"
        backUrl="/student/dashboard"
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search study groups by course, topic, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={loadStudyGroups}>
                <Search className="h-4 w-4 " />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? "Loading..." : `${studyGroups.length} study group${studyGroups.length !== 1 ? "s" : ""} found`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading study groups...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {studyGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                          <Badge variant={group.isJoined ? "default" : "outline"} className="ml-3">
                            {group.isJoined ? "Joined" : "Available"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{group.description}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.members}/{group.maxMembers} members
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {group.nextMeeting}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {group.location}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Badge variant="secondary">{group.course}</Badge>
                          {group.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        {group.isJoined ? (
                          <>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 " />
                              Chat
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleLeaveGroup(group.id)}
                            >
                              Leave Group
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={group.members >= group.maxMembers}
                          >
                            <UserPlus className="h-4 w-4 " />
                            {group.members >= group.maxMembers ? "Full" : "Join Group"}
                          </Button>
                        )}
                      </div>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or create a new study group.
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 " />
                  Create Study Group
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
