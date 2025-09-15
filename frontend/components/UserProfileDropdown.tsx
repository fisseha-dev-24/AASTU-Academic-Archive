"use client"

"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"

interface UserProfileDropdownProps {
  user: {
    id: number
    name: string
    email: string
    role: string
    department?: string | { name: string }
    student_id?: string
    department_id?: number
  } | null
}

export default function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student'
      case 'teacher':
        return 'Faculty'
      case 'department_head':
        return 'Department Head'
      case 'college_dean':
        return 'Dean'
      case 'admin':
        return 'Administrator'
      default:
        return role.charAt(0).toUpperCase() + role.slice(1)
    }
  }

  if (!user) {
    return (
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-sm bg-blue-600 text-white">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
            <p className="text-xs text-gray-600 leading-none">
              {user.email}
            </p>
            <p className="text-xs text-gray-600 leading-none">
              {getRoleDisplay(user.role)}
              {user.student_id && ` • ${user.student_id}`}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => router.push(`/${user.role}/profile`)}
          className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-gray-700 hover:text-blue-700"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => router.push(`/${user.role}/settings`)}
          className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-gray-700 hover:text-blue-700"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-gray-700 hover:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
