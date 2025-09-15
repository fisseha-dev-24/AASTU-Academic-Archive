"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  Video, 
  FileText,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  User,
  Tag,
  Download,
  Eye,
  Filter,
  Settings,
  Users,
  Calendar,
  Bell,
  Shield,
  Zap,
  ArrowLeft
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

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  helpful_count: number
  tags: string[]
}

interface HelpArticle {
  id: number
  title: string
  content: string
  category: string
  last_updated: string
  views: number
  helpful_count: number
  tags: string[]
}

interface SupportTicket {
  id: number
  subject: string
  description: string
  status: string
  priority: string
  created_at: string
  updated_at: string
}

export default function HelpPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("faq")
  const [searchTerm, setSearchTerm] = useState("")
  
  // FAQ and Help Articles
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([])
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])
  
  // Support ticket form
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "general"
  })

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
    
    loadHelpData()
  }, [])

  const loadHelpData = async () => {
    setLoading(true)
    try {
      const [faqResponse, articlesResponse, ticketsResponse] = await Promise.all([
        apiClient.getFAQs(),
        apiClient.getHelpArticles(),
        apiClient.getSupportTickets()
      ])
      
      if (faqResponse.success && faqResponse.data) {
        setFaqs(faqResponse.data)
      }
      
      if (articlesResponse.success && articlesResponse.data) {
        setHelpArticles(articlesResponse.data)
      }
      
      if (ticketsResponse.success && ticketsResponse.data) {
        setSupportTickets(ticketsResponse.data)
      }
    } catch (error) {
      console.error('Error loading help data:', error)
      setFaqs([])
      setHelpArticles([])
      setSupportTickets([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTicket = async () => {
    if (!ticketForm.subject || !ticketForm.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await apiClient.createSupportTicket(ticketForm)
      if (response.success) {
        toast.success('Support ticket created successfully')
        setTicketForm({
          subject: "",
          description: "",
          priority: "medium",
          category: "general"
        })
        loadHelpData()
      } else {
        toast.error('Failed to create support ticket')
      }
    } catch (error) {
      console.error('Error creating support ticket:', error)
      toast.error('Failed to create support ticket')
    }
  }

  const handleMarkHelpful = async (itemId: number, type: 'faq' | 'article') => {
    try {
      const response = type === 'faq' 
        ? await apiClient.markFAQHelpful(itemId)
        : await apiClient.markArticleHelpful(itemId)
      
      if (response.success) {
        toast.success('Thank you for your feedback!')
        loadHelpData()
      }
    } catch (error) {
      console.error('Error marking helpful:', error)
    }
  }

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading help center...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/student/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
              <p className="text-gray-600">Find answers to your questions and get the support you need</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors duration-200 mx-auto w-fit mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">User Guide</h3>
              <p className="text-sm text-gray-600">Complete guide to using the platform</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors duration-200 mx-auto w-fit mb-3">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Video Tutorials</h3>
              <p className="text-sm text-gray-600">Step-by-step video guides</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors duration-200 mx-auto w-fit mb-3">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-600">Get instant help from our team</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors duration-200 mx-auto w-fit mb-3">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Phone Support</h3>
              <p className="text-sm text-gray-600">Call us for urgent issues</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq" className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Help Articles</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Support Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Contact Us</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            {faq.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkHelpful(faq.id, 'faq')}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Helpful ({faq.helpful_count})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['Getting Started', 'Document Management', 'Study Groups', 'Account Settings', 'Troubleshooting'].map((topic) => (
                      <div key={topic} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium">{topic}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">Email Support</div>
                        <div className="text-xs text-gray-500">support@aastu.edu.et</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">Phone Support</div>
                        <div className="text-xs text-gray-500">+251 11 123 4567</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 leading-relaxed line-clamp-3">{article.content}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{article.views} views</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Updated {new Date(article.last_updated).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Read More
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkHelpful(article.id, 'article')}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              {article.helpful_count}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['Getting Started', 'Account Management', 'Document Features', 'Study Tools', 'Technical Issues'].map((category) => (
                      <div key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <span className="text-sm">{category}</span>
                        <Badge variant="outline" className="text-xs">12</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Support Tickets</h2>
              <Button onClick={() => setActiveTab('contact')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Updated {new Date(ticket.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {supportTickets.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                  <p className="text-gray-500 mb-4">You haven't created any support tickets yet.</p>
                  <Button onClick={() => setActiveTab('contact')}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <CardDescription>
                    Describe your issue and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Problem</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      placeholder="Please provide detailed information about your issue..."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                    />
                  </div>

                  <Button onClick={handleSubmitTicket} className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Other Ways to Contact Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Mail className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-medium">Email Support</div>
                        <div className="text-sm text-gray-600">support@aastu.edu.et</div>
                        <div className="text-xs text-gray-500">Response within 24 hours</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <Phone className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium">Phone Support</div>
                        <div className="text-sm text-gray-600">+251 11 123 4567</div>
                        <div className="text-xs text-gray-500">Mon-Fri 8AM-5PM</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-medium">Live Chat</div>
                        <div className="text-sm text-gray-600">Available 24/7</div>
                        <div className="text-xs text-gray-500">Instant response</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-800">System Down?</span>
                      </div>
                      <p className="text-sm text-red-700 mb-2">
                        If the system is completely down or you can't access your account:
                      </p>
                      <div className="text-sm text-red-600">
                        <div>Emergency Hotline: +251 11 123 4568</div>
                        <div>Email: emergency@aastu.edu.et</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

