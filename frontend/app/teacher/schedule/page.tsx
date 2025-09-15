"use client"

"use client"

"use client"

"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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

interface ScheduleItem {
  id: number
  title: string
  code: string
  type: string
  day: string
  time: string
  location: string
  students: number
  color: string
}

interface Deadline {
  id: number
  title: string
  course: string
  dueDate: string
  type: string
  priority: string
  description: string
  is_completed: boolean
}

interface OfficeHour {
  id: number
  day: string
  time: string
  location: string
  type: string
  notes: string
}

interface ScheduleData {
  schedule: ScheduleItem[]
  deadlines: Deadline[]
  officeHours: OfficeHour[]
}

export default function TeacherSchedule() {
  const [user, setUser] = useState<User | null>(null)
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("weekly")
  const [showAddModal, setShowAddModal] = useState(false)
  const [addEventType, setAddEventType] = useState<'schedule' | 'deadline' | 'office-hour'>('schedule')
  const [addEventLoading, setAddEventLoading] = useState(false)
  const [addEventError, setAddEventError] = useState<string | null>(null)
  const [addEventSuccess, setAddEventSuccess] = useState<string | null>(null)

  // Form state for adding events
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    code: '',
    type: 'lecture',
    day: 'Monday',
    time: '',
    location: '',
    students: 0
  })

  const [deadlineForm, setDeadlineForm] = useState({
    title: '',
    course_code: '',
    type: 'assignment',
    priority: 'medium',
    due_date: '',
    description: ''
  })

  const [officeHourForm, setOfficeHourForm] = useState({
    day: 'Monday',
    time: '',
    location: '',
    type: 'regular',
    notes: ''
  })

  useEffect(() => {
    // Load user info from localStorage
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo))
      } catch (e) {
        console.error('Failed to parse user info:', e)
      }
    }

    loadScheduleData()
  }, [])

  const loadScheduleData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getTeacherSchedule()
      
      if (response.success) {
        setScheduleData(response.data)
      } else {
        setError(response.message || 'Failed to load schedule data')
      }
    } catch (err) {
      console.error('Error loading schedule data:', err)
      setError('Failed to load schedule data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleAddEvent = async () => {
    try {
      setAddEventLoading(true)
      setAddEventError(null)
      setAddEventSuccess(null)

      let response
      if (addEventType === 'schedule') {
        response = await apiClient.addScheduleItem(scheduleForm)
      } else if (addEventType === 'deadline') {
        response = await apiClient.addDeadline(deadlineForm)
      } else {
        response = await apiClient.addOfficeHour(officeHourForm)
      }

      if (response.success) {
        setAddEventSuccess(response.message || 'Event added successfully!')
        resetForms()
        // Reload data
        setTimeout(() => {
          loadScheduleData()
          setShowAddModal(false)
        }, 1500)
      } else {
        setAddEventError(response.message || 'Failed to add event')
      }
    } catch (err) {
      console.error('Error adding event:', err)
      setAddEventError('Failed to add event. Please try again.')
    } finally {
      setAddEventLoading(false)
    }
  }

  const resetForms = () => {
    setScheduleForm({
      title: '', code: '', type: 'lecture', day: 'Monday', time: '', location: '', students: 0
    })
    setDeadlineForm({
      title: '', course_code: '', type: 'assignment', priority: 'medium', due_date: '', description: ''
    })
    setOfficeHourForm({
      day: 'Monday', time: '', location: '', type: 'regular', notes: ''
    })
    setAddEventError(null)
    setAddEventSuccess(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PageHeader 
        title="Class Schedule"
        subtitle="Manage your teaching schedule and deadlines"
        showBackButton={true}
        backUrl="/teacher/dashboard"
        user={user}
      >
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {addEventSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{addEventSuccess}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="office-hours">Office Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-blue-900">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Weekly Class Schedule
                </CardTitle>
                <CardDescription className="text-blue-700">Your teaching schedule for the current week</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {scheduleData?.schedule && scheduleData.schedule.length > 0 ? (
                  <div className="space-y-4">
                    {scheduleData.schedule.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.code} • {item.type}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.time}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {item.location}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {item.students} students
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No schedule items found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                <CardTitle className="flex items-center text-red-900">
                  <Clock className="h-5 w-5 mr-2 text-red-600" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription className="text-red-700">Track assignment deadlines and important dates</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {scheduleData?.deadlines && scheduleData.deadlines.length > 0 ? (
                  <div className="space-y-4">
                    {scheduleData.deadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${deadline.priority === 'high' ? 'bg-red-500' : deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{deadline.title}</h4>
                            <p className="text-sm text-gray-600">{deadline.course} • {deadline.type}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {deadline.dueDate}
                              </span>
                              <Badge variant={deadline.priority === 'high' ? 'destructive' : deadline.priority === 'medium' ? 'secondary' : 'default'}>
                                {deadline.priority} priority
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No deadlines found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="office-hours" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="flex items-center text-green-900">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Office Hours
                </CardTitle>
                <CardDescription className="text-green-700">Your scheduled office hours for student consultations</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {scheduleData?.officeHours && scheduleData.officeHours.length > 0 ? (
                  <div className="space-y-4">
                    {scheduleData.officeHours.map((officeHour) => (
                      <div
                        key={officeHour.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${officeHour.type === 'in-person' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{officeHour.day} Office Hours</h4>
                            <p className="text-sm text-gray-600">{officeHour.type}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {officeHour.time}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {officeHour.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No office hours scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Event Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Event Type</Label>
                <Select value={addEventType} onValueChange={(value: 'schedule' | 'deadline' | 'office-hour') => setAddEventType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">Class Schedule</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="office-hour">Office Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {addEventType === 'schedule' && (
                <div className="space-y-4">
                  <div>
                    <Label>Course Title</Label>
                    <Input
                      value={scheduleForm.title}
                      onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                      placeholder="e.g., Data Structures & Algorithms"
                    />
                  </div>
                  <div>
                    <Label>Course Code</Label>
                    <Input
                      value={scheduleForm.code}
                      onChange={(e) => setScheduleForm({...scheduleForm, code: e.target.value})}
                      placeholder="e.g., CS301"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={scheduleForm.type} onValueChange={(value) => setScheduleForm({...scheduleForm, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Day</Label>
                    <Select value={scheduleForm.day} onValueChange={(value) => setScheduleForm({...scheduleForm, day: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                      placeholder="e.g., 09:00 - 11:00"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={scheduleForm.location}
                      onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                      placeholder="e.g., Room 201, Building A"
                    />
                  </div>
                  <div>
                    <Label>Number of Students</Label>
                    <Input
                      type="number"
                      value={scheduleForm.students}
                      onChange={(e) => setScheduleForm({...scheduleForm, students: parseInt(e.target.value) || 0})}
                      placeholder="e.g., 32"
                    />
                  </div>
                </div>
              )}

              {addEventType === 'deadline' && (
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={deadlineForm.title}
                      onChange={(e) => setDeadlineForm({...deadlineForm, title: e.target.value})}
                      placeholder="e.g., Assignment 3 - Data Structures"
                    />
                  </div>
                  <div>
                    <Label>Course Code</Label>
                    <Input
                      value={deadlineForm.course_code}
                      onChange={(e) => setDeadlineForm({...deadlineForm, course_code: e.target.value})}
                      placeholder="e.g., CS301"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={deadlineForm.type} onValueChange={(value) => setDeadlineForm({...deadlineForm, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={deadlineForm.priority} onValueChange={(value) => setDeadlineForm({...deadlineForm, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={deadlineForm.due_date}
                      onChange={(e) => setDeadlineForm({...deadlineForm, due_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={deadlineForm.description}
                      onChange={(e) => setDeadlineForm({...deadlineForm, description: e.target.value})}
                      placeholder="e.g., Implement binary search tree operations"
                    />
                  </div>
                </div>
              )}

              {addEventType === 'office-hour' && (
                <div className="space-y-4">
                  <div>
                    <Label>Day</Label>
                    <Select value={officeHourForm.day} onValueChange={(value) => setOfficeHourForm({...officeHourForm, day: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      value={officeHourForm.time}
                      onChange={(e) => setOfficeHourForm({...officeHourForm, time: e.target.value})}
                      placeholder="e.g., 14:00 - 16:00"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={officeHourForm.location}
                      onChange={(e) => setOfficeHourForm({...officeHourForm, location: e.target.value})}
                      placeholder="e.g., Office 301, Faculty Building"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={officeHourForm.type} onValueChange={(value) => setOfficeHourForm({...officeHourForm, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="by_appointment">By Appointment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={officeHourForm.notes}
                      onChange={(e) => setOfficeHourForm({...officeHourForm, notes: e.target.value})}
                      placeholder="e.g., Available for consultation on Data Structures"
                    />
                  </div>
                </div>
              )}

              {addEventError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {addEventError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={handleAddEvent}
                  disabled={addEventLoading}
                  className="flex-1"
                >
                  {addEventLoading ? 'Adding...' : 'Add Event'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForms()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  )
}
