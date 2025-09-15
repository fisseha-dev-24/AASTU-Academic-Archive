"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  Home,
  Search,
  Download,
  Bookmark,
  History,
  Video,
  FileQuestion,
  Calendar,
  User,
  GraduationCap,
  Building2,
  Shield,
  UserCheck,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  Filter,
  Star,
  Target,
  Zap,
  Globe,
  Database,
  Server,
  Monitor,
  Lock,
  Key,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  RefreshCw,
  Archive,
  FolderOpen,
  FileImage,
  FileVideo,
  FileAudio,
  FilePdf,
  FileSpreadsheet,
  FileCode,
  File,
  Folder,
  FolderPlus,
  Tag,
  Hash,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  X,
  Menu,
  Search as SearchIcon,
  Bell as BellIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  Lightbulb,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string | { name: string }
  student_id?: string
  department_id?: number
  avatar?: string
}

interface AppSidebarProps {
  user?: User | null
  role: 'student' | 'teacher' | 'department_head' | 'college_dean' | 'admin'
}

// Navigation items for different roles
const navigationItems = {
  student: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Browse Documents",
      url: "/student/browse",
      icon: Search,
    },
    {
      title: "My Documents",
      url: "/student/my-documents",
      icon: FileText,
      subItems: [
        {
          title: "Bookmarks",
          url: "/student/bookmarks",
          icon: Bookmark,
        },
        {
          title: "History",
          url: "/student/history",
          icon: History,
        },
      ],
    },
    {
      title: "Study Resources",
      url: "/student/study",
      icon: BookOpen,
      subItems: [
        {
          title: "Video Lectures",
          url: "/student/videos",
          icon: Video,
        },
        {
          title: "Exam Materials",
          url: "/student/exams",
          icon: FileQuestion,
        },
        {
          title: "Study Groups",
          url: "/student/study-groups",
          icon: Users,
        },
      ],
    },
    {
      title: "Calendar",
      url: "/student/calendar",
      icon: Calendar,
    },
    {
      title: "Suggestions",
      url: "/student/suggestions",
      icon: Lightbulb,
    },
  ],
  teacher: [
    {
      title: "Dashboard",
      url: "/teacher/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Documents",
      url: "/teacher/my-documents",
      icon: FileText,
    },
    {
      title: "Upload Documents",
      url: "/teacher/upload",
      icon: Upload,
    },
    {
      title: "Pending Approval",
      url: "/teacher/pending-approval",
      icon: Clock,
    },
    {
      title: "Reviews",
      url: "/teacher/reviews",
      icon: MessageSquare,
    },
    {
      title: "Student Feedback",
      url: "/teacher/student-feedback",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/teacher/analytics",
      icon: BarChart3,
    },
    {
      title: "Schedule",
      url: "/teacher/schedule",
      icon: Calendar,
    },
    {
      title: "Manage",
      url: "/teacher/manage",
      icon: Settings,
    },
  ],
  department_head: [
    {
      title: "Dashboard",
      url: "/department/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Overview",
      url: "/department/overview",
      icon: BarChart3,
    },
    {
      title: "Documents",
      url: "/department/documents",
      icon: FileText,
    },
    {
      title: "Approvals",
      url: "/department/approvals",
      icon: CheckCircle,
    },
    {
      title: "Teachers",
      url: "/department/teachers",
      icon: Users,
    },
    {
      title: "Courses",
      url: "/department/courses",
      icon: BookOpen,
    },
    {
      title: "Reports",
      url: "/department/reports",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/department/analytics",
      icon: TrendingUp,
    },
    {
      title: "Profile",
      url: "/department/profile",
      icon: User,
    },
  ],
  college_dean: [
    {
      title: "Dashboard",
      url: "/dean/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Overview",
      url: "/dean/overview",
      icon: BarChart3,
    },
    {
      title: "Departments",
      url: "/dean/departments",
      icon: Building2,
    },
    {
      title: "Faculty",
      url: "/dean/faculty",
      icon: Users,
    },
    {
      title: "Documents",
      url: "/dean/documents",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/dean/analytics",
      icon: TrendingUp,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "System",
      url: "/admin/system",
      icon: Server,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
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

export function AppSidebar({ user, role }: AppSidebarProps) {
  const pathname = usePathname()
  const items = navigationItems[role] || []

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    window.location.href = '/login'
  }

  return (
    <Sidebar variant="inset" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <img 
            src="/aastu-university-logo-blue-and-green.png" 
            alt="AASTU Logo" 
            className="h-10 w-10 rounded-lg" 
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">AASTU Archive</h2>
            <p className="text-xs text-gray-500 truncate">Academic Hub</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={cn(
                      "w-full justify-start text-sm font-medium transition-colors duration-200",
                      pathname === item.url
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                            className={cn(
                              "text-sm transition-colors duration-200",
                              pathname === subItem.url
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <Link href={subItem.url} className="flex items-center space-x-3">
                              <subItem.icon className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                >
                  <Link href="/help" className="flex items-center space-x-3">
                    <HelpCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Help & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                >
                  <Link href="/notifications" className="flex items-center space-x-3">
                    <Bell className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Notifications</span>
                    <Badge variant="secondary" className="ml-auto bg-red-100 text-red-800 text-xs">
                      3
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="space-y-3">
          {/* User Profile Section */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <div className="flex items-center space-x-2">
                <Badge className={cn("text-xs", getRoleColor(role))}>
                  {getRoleDisplayName(role)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 text-xs"
            >
              <Link href="/profile" className="flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span>Profile</span>
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 text-xs"
            >
              <Link href="/settings" className="flex items-center space-x-2">
                <Settings className="h-3 w-3" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-3 w-3 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
