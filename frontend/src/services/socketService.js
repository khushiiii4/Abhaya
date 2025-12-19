import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect(token) {
    if (this.socket?.connected) return

    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    
    this.socket = io(socketURL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
    }
  }

  joinUserRoom(userId) {
    if (this.socket) {
      this.socket.emit('join', userId)
      console.log('👤 Joined user room:', userId)
    }
  }

  // Listen for SOS alerts
  onSOSAlert(callback) {
    if (this.socket) {
      this.socket.on('sos:alert', callback)
      this.listeners.set('sos:alert', callback)
    }
  }

  // Listen for SOS resolved
  onSOSResolved(callback) {
    if (this.socket) {
      this.socket.on('sos:resolved', callback)
      this.listeners.set('sos:resolved', callback)
    }
  }

  // Emit SOS trigger
  triggerSOS(data) {
    if (this.socket) {
      this.socket.emit('sos:triggered', data)
    }
  }

  // Emit SOS resolve
  resolveSOSEvent(data) {
    if (this.socket) {
      this.socket.emit('sos:resolve', data)
    }
  }

  // Remove specific listener
  off(eventName) {
    if (this.socket && this.listeners.has(eventName)) {
      this.socket.off(eventName, this.listeners.get(eventName))
      this.listeners.delete(eventName)
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, eventName) => {
        this.socket.off(eventName, callback)
      })
      this.listeners.clear()
    }
  }
}

export default new SocketService()
