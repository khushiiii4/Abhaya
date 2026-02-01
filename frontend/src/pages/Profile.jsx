import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { User, Mail, Phone, LogOut } from 'lucide-react'
import axios from '../api/axios'

export default function Profile(){
  const { user, logout, updateUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/auth/me')
        updateUser(response.data)
        setFormName(response.data?.name || '')
        setFormPhone(response.data?.phone || '')
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [updateUser])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  const handleSave = async () => {
    try {
      setError(null)
      const response = await axios.put('/auth/profile', {
        name: formName,
        phone: formPhone,
      })
      updateUser(response.data)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="glass-card rounded-none border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glass">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-heading">Profile</h1>
              <p className="text-sm text-text-secondary">Manage your account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6">
        {/* Profile Card */}
        <div className="glass-card rounded-3xl p-6 border border-white/40 mb-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glass mb-3">
              <span className="text-white font-bold text-3xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-text-heading">{user?.name || 'User'}</h2>
            <p className="text-text-secondary text-sm">Member since {new Date().toLocaleDateString()}</p>
          </div>

          {isLoading && (
            <div className="text-center text-text-secondary text-sm">Loading profile...</div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2 mb-4">
              {error}
            </div>
          )}

          {/* User Info */}
          <div className="space-y-4">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#C471ED]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading"
                    />
                  ) : (
                    <p className="text-text-heading font-semibold">{user?.name || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#C471ED]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Email Address</p>
                  <p className="text-text-heading font-semibold">{user?.email || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#C471ED]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading"
                    />
                  ) : (
                    <p className="text-text-heading font-semibold">{user?.phone || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        <div className="flex gap-3 mb-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-primary hover:shadow-glass text-white font-semibold py-3 rounded-2xl transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-text-heading font-semibold py-3 rounded-2xl transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-white/20 hover:bg-white/30 text-text-heading font-semibold py-3 rounded-2xl transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:shadow-glass text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 bg-white/20 hover:bg-white/30 text-text-heading font-semibold py-4 rounded-2xl transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
