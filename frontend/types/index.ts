export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department?: string
  college?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserRole = "student" | "teacher" | "department_head" | "college_dean" | "admin"

export interface Document {
  id: string
  title: string
  description: string
  filePath: string
  fileType: string
  fileSize: number
  uploadedBy: string
  department: string
  college: string
  year: number
  tags: string[]
  status: DocumentStatus
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type DocumentStatus = "pending" | "approved" | "rejected"

export interface Department {
  id: string
  name: string
  code: string
  college: string
  headId?: string
}

export interface College {
  id: string
  name: string
  code: string
  deanId?: string
}
