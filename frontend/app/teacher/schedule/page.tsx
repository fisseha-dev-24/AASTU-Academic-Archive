"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const scheduleData = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    code: "CS301",
    type: "lecture",
    day: "Monday",
    time: "09:00 - 11:00",
    location: "Room 201, Building A",
    students: 32,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    title: "Database Systems",
    code: "CS302",
    type: "lecture",
    day: "Tuesday",
    time: "14:00 - 16:00",
    location: "Room 305, Building B",
    students: 28,
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    id: 3,
    title: "Data Structures Lab",
    code: "CS301L",
    type: "lab",
    day: "Wednesday",
    time: "10:00 - 12:00",
    location: "Computer Lab 1",
    students: 16,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 4,
    title: "Software Engineering",
    code: "CS401",
    type: "lecture",
    day: "Thursday",
    time: "11:00 - 13:00",
    location: "Room 102, Building C",
    students: 25,
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: 5,
    title: "Database Systems Lab",
    code: "CS302L",
    type: "lab",
    day: "Friday",
    time: "08:00 - 10:00",
    location: "Computer Lab 2",
    students: 14,
    color: "bg-teal-100 text-teal-800",
  },
]

const upcomingDeadlines = [
  {
    id: 1,
    title: "Assignment 3 - Data Structures",
    course: "CS301",
    dueDate: "2024-01-20",
    type: "assignment",
    priority: "high",
  },
  {
    id: 2,
    title: "Midterm Exam - Database Systems",
    course: "CS302",
    dueDate: "2024-01-25",
    type: "exam",
    priority: "high",
  },
  {
    id: 3,
    title: "Project Proposal - Software Engineering",
    course: "CS401",
    dueDate: "2024-01-30",
    type: "project",
    priority: "medium",
  },
]

const officeHours = [
  {
    day: "Monday",
    time: "14:00 - 16:00",
    location: "Office 301, Faculty Building",
    type: "regular",
  },
  {
    day: "Wednesday",
    time: "15:00 - 17:00",
    location: "Office 301, Faculty Building",
    type: "regular",
  },
  {
    day: "Friday",
    time: "13:00 - 14:00",
    location: "Online (Zoom)",
    type: "online",
  },
]

export default function TeacherSchedule() {
  const [activeTab, setActiveTab] = useState("weekly")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/teacher/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img src="/aastu-university-logo-blue-and-green.png" alt="AASTU Logo" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
                <p className="text-sm text-gray-600">Manage your teaching schedule and deadlines</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>DT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
            <TabsTrigger value="office-hours">Office Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  Weekly Class Schedule
                </CardTitle>
                <CardDescription>Your regular teaching schedule for this semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduleData.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <CardDescription>{item.code}</CardDescription>
                          </div>
                          <Badge className={item.color}>{item.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {item.day}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {item.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {item.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {item.students} students
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Important dates and deadlines for your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                        <p className="text-sm text-gray-600">Course: {deadline.course}</p>
                        <p className="text-sm text-gray-500">Due: {new Date(deadline.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{deadline.type}</Badge>
                        <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="office-hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-emerald-600 mr-2" />
                  Office Hours
                </CardTitle>
                <CardDescription>Your availability for student consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {officeHours.map((hour, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{hour.day}</h4>
                            <p className="text-sm text-gray-600">{hour.time}</p>
                          </div>
                          <Badge variant="outline" className={hour.type === "online" ? "bg-blue-50" : "bg-gray-50"}>
                            {hour.type}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {hour.location}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
