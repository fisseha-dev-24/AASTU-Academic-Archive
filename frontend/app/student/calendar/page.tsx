"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, MapPin, Bell, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function AcademicCalendarPage() {
  const events = [
    {
      id: 1,
      title: "Software Engineering Final Exam",
      date: "2024-01-25",
      time: "9:00 AM",
      location: "Hall A",
      type: "exam",
      course: "SE 301",
    },
    {
      id: 2,
      title: "Database Systems Assignment Due",
      date: "2024-01-22",
      time: "11:59 PM",
      location: "Online Submission",
      type: "assignment",
      course: "CS 205",
    },
    {
      id: 3,
      title: "Study Group Meeting",
      date: "2024-01-20",
      time: "2:00 PM",
      location: "Library Room 204",
      type: "meeting",
      course: "SE 301",
    },
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-red-100 text-red-800 border-red-200"
      case "assignment":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "meeting":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
                <p className="text-sm text-gray-600">Track important dates and deadlines</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                    January 2024
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Simple calendar grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div key={day} className="p-2 text-center text-sm hover:bg-gray-100 rounded cursor-pointer">
                      <span
                        className={
                          day === 20 || day === 22 || day === 25 ? "bg-blue-600 text-white rounded-full px-2 py-1" : ""
                        }
                      >
                        {day}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                      <Badge className={`mt-2 text-xs ${getEventColor(event.type)}`}>{event.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Exams</span>
                    <Badge className="bg-red-100 text-red-800">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assignments</span>
                    <Badge className="bg-blue-100 text-blue-800">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Meetings</span>
                    <Badge className="bg-green-100 text-green-800">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
