import React, { createContext, useEffect, useState } from 'react'
import socketService from '../services/socketService'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch { return null }
  })

  useEffect(()=>{
    const t = localStorage.getItem('token')
    // Clear old demo-token if exists
    if(t === 'demo-token') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } else if(t) {
      setToken(t)
    }
  }, [])

  // Connect socket when user logs in
  useEffect(() => {
    if (token && user) {
      socketService.connect(token)
      if (user._id) {
        socketService.joinUserRoom(user._id)
      }
    } else {
      socketService.disconnect()
    }
  }, [token, user])

  function login(userData, tokenValue){
    if (!tokenValue || !userData) {
      console.error('Login requires valid user data and token')
      return
    }
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function updateUser(userData){
    if (!userData) return
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout(){
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    socketService.disconnect()
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
