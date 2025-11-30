import React, { useState, useEffect } from 'react'
import { FaExclamationTriangle, FaTimes, FaPhone, FaLocationArrow, FaMicrophone, FaUsers } from 'react-icons/fa'

export default function SOSConfirmModal({ isOpen, onCancel, onConfirm }) {
  const [countdown, setCountdown] = useState(5)
  const [isCountingDown, setIsCountingDown] = useState(false)

  useEffect(() => {
    let interval = null
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      handleConfirmSOS()
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isCountingDown, countdown])

  const handleStartCountdown = () => {
    setIsCountingDown(true)
  }

  const handleCancel = () => {
    setIsCountingDown(false)
    setCountdown(5)
    onCancel()
  }

  const handleConfirmSOS = () => {
    setIsCountingDown(false)
    setCountdown(5)
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-neumorphic max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center relative">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
            <FaExclamationTriangle className="text-4xl animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Emergency SOS</h2>
          <p className="text-red-100 text-lg">Are you sure you want to send an emergency alert?</p>
          
          {/* Close Button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gradient-soft p-5 rounded-2xl mb-6 shadow-neumorphic-inset">
            <h3 className="font-bold text-textDark mb-4 text-lg">This will immediately:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-soft">
                  <FaPhone className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">Alert all emergency contacts</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-soft">
                  <FaLocationArrow className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">Share your exact location</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-soft">
                  <FaMicrophone className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">Start emergency recording</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-soft">
                  <FaUsers className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">Notify nearby users</span>
              </div>
            </div>
          </div>

          {/* Countdown or Action Buttons */}
          {isCountingDown ? (
            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-soft animate-pulse">
                <span className="text-5xl font-bold text-white">{countdown}</span>
              </div>
              <p className="text-gray-600 text-lg mb-6 font-medium">Sending emergency alert in <span className="text-red-600 font-bold">{countdown}</span> seconds...</p>
              <button
                onClick={handleCancel}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg transition-all shadow-neumorphic"
              >
                <FaTimes size={18} /> Cancel Emergency
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleStartCountdown}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 text-white rounded-2xl font-bold text-lg transition-all shadow-soft hover:shadow-lg hover:scale-105"
              >
                <FaExclamationTriangle size={20} /> Confirm Emergency
              </button>
              
              <button
                onClick={handleCancel}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg transition-all shadow-neumorphic"
              >
                <FaTimes size={18} /> Cancel
              </button>
            </div>
          )}

          <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
            <p className="text-yellow-800 text-sm text-center font-medium">
              ⚠️ Use only in real emergencies
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
