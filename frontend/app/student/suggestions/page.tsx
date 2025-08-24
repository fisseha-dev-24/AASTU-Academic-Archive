"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Lightbulb, Star, TrendingUp, Clock, Download, Eye, BookOpen } from "lucide-react"
import Link from "next/link"

export default function SuggestionsPage() {
  const suggestions = [
    {
      id: 1,
      title: "Advanced Database Design Patterns",
      author: "Dr. Sarah Johnson",
      department: "Software Engineering",
      relevance: 95,
      reason: "Based on your recent searches in database systems",
      type: "Research Paper",
      downloads: 234,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Machine Learning in Software Testing",
      author: "Prof. Michael Chen",
      department: "Computer Science",
      relevance: 88,
      reason: "Popular among students in your program",
      type: "Thesis",
      downloads: 156,
      rating: 4.6,
    },
    {
      id: 3,
      title: "Cloud Computing Architecture Guide",
      author: "Dr. Emily Davis",
      department: "Information Technology",
      relevance: 82,
      reason: "Trending in your field of study",
      type: "Technical Report",
      downloads: 189,
      rating: 4.7,
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
                <h1 className="text-2xl font-bold text-gray-900">Personalized Suggestions</h1>
                <p className="text-sm text-gray-600">AI-powered document recommendations</p>
              </div>
            </div>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-8 w-8 text-emerald-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          <p className="text-gray-600">
            Based on your academic interests, search history, and trending content in your field.
          </p>
        </div>

        <div className="space-y-6">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>By {suggestion.author}</span>
                      <span>•</span>
                      <span>{suggestion.department}</span>
                      <span>•</span>
                      <Badge variant="secondary">{suggestion.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {suggestion.downloads} downloads
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {suggestion.rating}
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm text-emerald-700 font-medium">{suggestion.relevance}% match</span>
                      <span className="text-sm text-gray-500 ml-2">• {suggestion.reason}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-6">
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Suggestion Categories */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recently Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Latest documents in your areas of interest</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                View Recent
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Popular documents among your peers</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                View Trending
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Star className="h-5 w-5 mr-2 text-purple-600" />
                Highly Rated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Top-rated documents in your field</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                View Top Rated
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
