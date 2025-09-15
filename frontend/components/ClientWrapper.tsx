"use client"

"use client"

import { ReactNode } from 'react'

interface ClientWrapperProps {
  children: ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return <>{children}</>
}
