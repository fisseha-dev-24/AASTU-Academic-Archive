"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Users, Search, Plus, MessageCircle, Calendar, Clock, UserPlus } from "lucide-react"
import Link from "next/link"

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const studyGroups = [
    {
      id: 1,
      name: "Software Engineering Study Circle",
      course: "SE 301",
      members: 8,
      maxMembers: 12,
      description: "Weekly discussions on software design patterns and project management",
      nextMeeting: "Tomorrow, 2:00 PM",
      location: "Library Room 204",
      tags: ["Software Engineering", "Design Patterns", "Project Management"],
      isJoined: true,
    },
    {
      id: 2,
      name: "Database Systems Workshop",
      course: "CS 205",
      members: 6,
      maxMembers: 10,
      description: "Hands-on practice with SQL queries and database optimization",
      nextMeeting: "Friday, 10:00 AM",
      location: "Computer Lab 3",
      tags: ["Database", "SQL", "Optimization"],
      isJoined: false,
    },
    {
      id: 3,
      name: "Machine Learning Research Group",
      course: "CS 401",
      members: 5,
      maxMembers: 8,
      description: "Exploring latest ML algorithms and working on research projects",
      nextMeeting: "Monday, 4:00 PM",
      location: "Research Lab A",
      tags: ["Machine Learning", "Research", "AI"],
      isJoined: false,
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
                <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
                <p className="text-sm text-gray-600">Collaborative learning communities</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

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
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Study Groups List */}
        <div className="space-y-6 mb-12">
          {studyGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Users className="h-6 w-6 text-orange-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                      {group.isJoined && <Badge className="ml-3 bg-green-100 text-green-800">Joined</Badge>}
                    </div>

                    <p className="text-gray-600 mb-3">{group.description}</p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <span className="font-medium">{group.course}</span>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {group.members}/{group.maxMembers} members
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {group.nextMeeting}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {group.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
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
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                My Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 mb-2">3</p>
              <p className="text-sm text-gray-600">Active study groups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 mb-2">5</p>
              <p className="text-sm text-gray-600">Scheduled meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 mb-2">12</p>
              <p className="text-sm text-gray-600">Unread messages</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
