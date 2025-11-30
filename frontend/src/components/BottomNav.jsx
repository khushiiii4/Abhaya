import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaHome, FaMap, FaExclamationTriangle, FaShieldAlt, FaUsers } from 'react-icons/fa'
import SOSConfirmModal from './SOSConfirmModal'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showSOSAlert, setShowSOSAlert] = useState(false)
  const [showSOSModal, setShowSOSModal] = useState(false)

  const handleSOSClick = () => {
    setShowSOSModal(true)
  }

  const handleSOSConfirm = () => {
    setShowSOSModal(false)
    setShowSOSAlert(true)
    setTimeout(() => setShowSOSAlert(false), 3000)
    // Here you would typically call your emergency API
    console.log('🚨 SOS Emergency Triggered!')
  }

  const handleSOSCancel = () => {
    setShowSOSModal(false)
  }

  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Home' },
    { path: '/map', icon: FaMap, label: 'Map' },
    { path: '/sos', icon: FaExclamationTriangle, label: 'SOS', isSpecial: true },
    { path: '/safezones', icon: FaShieldAlt, label: 'Safe Zones' },
    { path: '/contacts', icon: FaUsers, label: 'Contacts' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* SOS Mock Alert */}
      {showSOSAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-gradient-primary text-white px-6 py-4 rounded-2xl shadow-soft flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <div>
              <p className="font-bold text-lg">🚨 SOS Activated</p>
              <p className="text-sm opacity-90">Emergency contacts notified</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t-2 border-pink-100 z-[1000]">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              if (item.isSpecial) {
                // SOS Button - Special handling with new theme
                return (
                  <button
                    key={item.path}
                    onClick={handleSOSClick}
                    className="flex flex-col items-center transform -translate-y-3 relative group animate-pulse-slow"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-primary rounded-full animate-ping opacity-30"></div>
                      <div className="relative w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft group-hover:shadow-lg group-hover:scale-110 transition-all duration-200">
                        <Icon className="text-white text-2xl" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-textDark mt-1 bg-gradient-primary bg-clip-text text-transparent">
                      {item.label}
                    </span>
                  </button>
                )
              }

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center py-2 px-2 transition-all duration-200 hover:scale-110"
                >
                  <Icon 
                    className={`text-xl mb-1 ${
                      active 
                        ? 'text-primary' 
                        : 'text-gray-400'
                    }`} 
                  />
                  <span className={`text-xs font-medium ${
                    active 
                      ? 'bg-gradient-primary bg-clip-text text-transparent font-bold' 
                      : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* SOS Confirmation Modal */}
      <SOSConfirmModal 
        isOpen={showSOSModal}
        onCancel={handleSOSCancel}
        onConfirm={handleSOSConfirm}
      />
    </>
  )
}
