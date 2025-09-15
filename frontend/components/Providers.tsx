"use client"

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ModalProvider } from '@/components/ui/modal'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ModalProvider>
        {children}
        <Toaster />
      </ModalProvider>
    </AuthProvider>
  )
}
