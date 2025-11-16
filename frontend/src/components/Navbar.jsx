import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  if(!isAuthenticated) return null

  return (
    <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-100 px-6 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Abhaya" className="w-10 h-10 rounded-full" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='/logo.svg.png'}} />
          <div className="font-semibold text-gray-800">Abhaya</div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
          <Link to="/sos" className="text-gray-700 hover:text-indigo-600">SOS</Link>
          <Link to="/contacts" className="text-gray-700 hover:text-indigo-600">Contacts</Link>
          <Link to="/reports" className="text-gray-700 hover:text-indigo-600">Reports</Link>
          <Link to="/zones" className="text-gray-700 hover:text-indigo-600">Safe Zones</Link>
          <Link to="/profile" className="text-gray-700 hover:text-indigo-600">Profile</Link>
          <span className="text-sm text-gray-700">{user?.name}</span>
          <button onClick={handleLogout} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-md hover:opacity-95 transition">Logout</button>
        </div>
      </div>
    </nav>
  )
}
