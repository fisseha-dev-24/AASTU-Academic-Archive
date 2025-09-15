"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { cn } from '@/lib/utils'

// Modal Types
export type ModalType = 'default' | 'form' | 'confirmation' | 'alert' | 'fullscreen'

// Modal Props
export interface ModalProps {
  id: string
  type: ModalType
  title: string
  description?: string
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  loading?: boolean
  disabled?: boolean
}

// Modal Context
interface ModalContextType {
  modals: ModalProps[]
  openModal: (modal: Omit<ModalProps, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  updateModal: (id: string, updates: Partial<ModalProps>) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

// Modal Provider
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalProps[]>([])

  const openModal = useCallback((modal: Omit<ModalProps, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9)
    const newModal: ModalProps = {
      id,
      type: 'default',
      size: 'md',
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
      loading: false,
      disabled: false,
      ...modal,
    }
    
    setModals(prev => [...prev, newModal])
    return id
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id))
  }, [])

  const closeAllModals = useCallback(() => {
    setModals([])
  }, [])

  const updateModal = useCallback((id: string, updates: Partial<ModalProps>) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, ...updates } : modal
    ))
  }, [])

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  )
}

// Modal Container
function ModalContainer() {
  const { modals, closeModal } = useModal()

  const handleOverlayClick = (modal: ModalProps, e: React.MouseEvent) => {
    if (e.target === e.currentTarget && modal.closeOnOverlayClick) {
      closeModal(modal.id)
    }
  }

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const topModal = modals[modals.length - 1]
      if (topModal?.closeOnEscape) {
        closeModal(topModal.id)
      }
    }
  }, [modals, closeModal])

  React.useEffect(() => {
    if (modals.length > 0) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [modals.length, handleEscape])

  if (modals.length === 0) return null

  return (
    <div className="fixed inset-0 z-50">
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ zIndex: 1000 + index }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={(e) => handleOverlayClick(modal, e)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-h-full overflow-auto">
            <ModalContent modal={modal} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Modal Content
function ModalContent({ modal }: { modal: ModalProps }) {
  const { closeModal, updateModal } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (modal.onConfirm) {
      try {
        setIsLoading(true)
        updateModal(modal.id, { loading: true })
        await modal.onConfirm()
        closeModal(modal.id)
      } catch (error) {
        console.error('Modal confirm error:', error)
      } finally {
        setIsLoading(false)
        updateModal(modal.id, { loading: false })
      }
    } else {
      closeModal(modal.id)
    }
  }

  const handleCancel = () => {
    if (modal.onCancel) {
      modal.onCancel()
    }
    closeModal(modal.id)
  }

  const getSizeClasses = () => {
    switch (modal.size) {
      case 'sm':
        return 'max-w-sm'
      case 'md':
        return 'max-w-md'
      case 'lg':
        return 'max-w-lg'
      case 'xl':
        return 'max-w-xl'
      case 'full':
        return 'max-w-7xl'
      default:
        return 'max-w-md'
    }
  }

  const getIcon = () => {
    switch (modal.type) {
      case 'alert':
        return <AlertCircle className="h-6 w-6 text-blue-600" />
      case 'confirmation':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'form':
        return <Info className="h-6 w-6 text-green-600" />
      default:
        return null
    }
  }

  return (
    <Card className={cn(
      "w-full shadow-2xl border-0",
      getSizeClasses(),
      modal.type === 'fullscreen' && "h-screen max-h-screen"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <div>
            <CardTitle className="text-lg font-semibold">{modal.title}</CardTitle>
            {modal.description && (
              <p className="text-sm text-gray-600 mt-1">{modal.description}</p>
            )}
          </div>
        </div>
        {modal.showCloseButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => closeModal(modal.id)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {modal.children}
        
        {/* Action Buttons */}
        {(modal.onConfirm || modal.onCancel) && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            {modal.onCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={modal.loading || modal.disabled}
              >
                {modal.cancelText || 'Cancel'}
              </Button>
            )}
            {modal.onConfirm && (
              <Button
                variant={modal.confirmVariant || 'default'}
                onClick={handleConfirm}
                disabled={modal.loading || modal.disabled}
                className="min-w-[80px]"
              >
                {modal.loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  modal.confirmText || 'Confirm'
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Hook to use modal context
export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

// Predefined modal functions
export function useModalHelpers() {
  const { openModal } = useModal()

  const showConfirmation = useCallback((
    title: string,
    description: string,
    onConfirm: () => void | Promise<void>,
    options?: Partial<ModalProps>
  ) => {
    return openModal({
      type: 'confirmation',
      title,
      description,
      onConfirm,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmVariant: 'destructive',
      ...options,
    })
  }, [openModal])

  const showAlert = useCallback((
    title: string,
    description: string,
    options?: Partial<ModalProps>
  ) => {
    return openModal({
      type: 'alert',
      title,
      description,
      onConfirm: () => {},
      confirmText: 'OK',
      showCloseButton: false,
      ...options,
    })
  }, [openModal])

  const showForm = useCallback((
    title: string,
    children: ReactNode,
    onConfirm: () => void | Promise<void>,
    options?: Partial<ModalProps>
  ) => {
    return openModal({
      type: 'form',
      title,
      children,
      onConfirm,
      confirmText: 'Save',
      cancelText: 'Cancel',
      size: 'lg',
      ...options,
    })
  }, [openModal])

  return {
    showConfirmation,
    showAlert,
    showForm,
  }
}

// Export modal types for external use
export type { ModalProps, ModalType }
