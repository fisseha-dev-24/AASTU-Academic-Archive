import { apiClient } from './api'
import { toast } from 'sonner'

export interface WebSocketMessage {
  type: 'notification' | 'document_update' | 'user_update' | 'system_alert' | 'real_time_data'
  data: any
  timestamp: string
  id: string
}

export interface WebSocketConfig {
  url: string
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
}

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> = new Map()
  private isConnecting = false
  private config: WebSocketConfig

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = {
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:6001',
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    }
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true

    try {
      // Get WebSocket token for authentication
      const response = await apiClient.getWebSocketToken()
      if (!response.success) {
        throw new Error('Failed to get WebSocket token')
      }

      const token = response.data?.token
      const wsUrl = `${this.config.url}?token=${token}`

      this.ws = new WebSocket(wsUrl)
      this.setupEventHandlers()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.isConnecting = false
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.emit('connected')
    }

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason)
      this.cleanup()
      this.emit('disconnected')
      
      if (event.code !== 1000) { // Not a normal closure
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    // Handle different message types
    switch (message.type) {
      case 'notification':
        this.handleNotification(message.data)
        break
      case 'document_update':
        this.handleDocumentUpdate(message.data)
        break
      case 'user_update':
        this.handleUserUpdate(message.data)
        break
      case 'system_alert':
        this.handleSystemAlert(message.data)
        break
      case 'real_time_data':
        this.handleRealTimeData(message.data)
        break
      default:
        console.log('Unknown message type:', message.type)
    }

    // Emit to registered handlers
    this.emit(message.type, message.data)
  }

  private handleNotification(data: any): void {
    const { title, message, type = 'info' } = data
    
    switch (type) {
      case 'success':
        toast.success(message, { description: title })
        break
      case 'error':
        toast.error(message, { description: title })
        break
      case 'warning':
        toast.warning(message, { description: title })
        break
      default:
        toast(message, { description: title })
    }
  }

  private handleDocumentUpdate(data: any): void {
    const { action, document } = data
    let message = ''
    
    switch (action) {
      case 'created':
        message = `New document "${document.title}" has been uploaded`
        break
      case 'updated':
        message = `Document "${document.title}" has been updated`
        break
      case 'approved':
        message = `Document "${document.title}" has been approved`
        break
      case 'rejected':
        message = `Document "${document.title}" has been rejected`
        break
      default:
        message = `Document "${document.title}" has been ${action}`
    }
    
    toast.info(message)
  }

  private handleUserUpdate(data: any): void {
    const { action, user } = data
    let message = ''
    
    switch (action) {
      case 'status_changed':
        message = `User ${user.name} status changed to ${user.status}`
        break
      case 'role_changed':
        message = `User ${user.name} role changed to ${user.role}`
        break
      default:
        message = `User ${user.name} has been ${action}`
    }
    
    toast.info(message)
  }

  private handleSystemAlert(data: any): void {
    const { severity, message, title } = data
    
    switch (severity) {
      case 'critical':
        toast.error(message, { description: title })
        break
      case 'warning':
        toast.warning(message, { description: title })
        break
      default:
        toast.info(message, { description: title })
    }
  }

  private handleRealTimeData(data: any): void {
    // Handle real-time data updates (analytics, metrics, etc.)
    this.emit('real_time_data', data)
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }))
      }
    }, this.config.heartbeatInterval)
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)
    
    this.reconnectTimer = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`)
      this.connect()
    }, delay)
  }

  private cleanup(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'User initiated disconnect')
      this.ws = null
    }
    this.cleanup()
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  // Event handling
  private eventHandlers: Map<string, Set<Function>> = new Map()

  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error('Error in event handler:', error)
        }
      })
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'closed'
      default:
        return 'unknown'
    }
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService()

// Export the class for testing or custom instances
export { WebSocketService }

// Hook for React components
export function useWebSocket() {
  return webSocketService
}
