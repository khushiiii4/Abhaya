import React, { createContext, useEffect, useState } from 'react'

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
    if(t) setToken(t)
  }, [])

  function login(userData, tokenValue){
    const tk = tokenValue || 'demo-token'
    setToken(tk)
    setUser(userData || { name: userData?.name || 'Demo User', email: userData?.email || 'demo@local' })
    localStorage.setItem('token', tk)
    if(userData) localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout(){
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
