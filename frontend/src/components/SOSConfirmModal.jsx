import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function SOSConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Glassmorphism backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <FaExclamationTriangle className="text-5xl text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
          Trigger Emergency SOS?
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 text-center mb-8">
          This will immediately alert your emergency contacts and share your live location. 
          Only use in real emergencies.
        </p>

        {/* What will happen */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-2">This will:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Send instant alerts to all emergency contacts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Share your live location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Start audio recording</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Alert nearby users</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all duration-200"
          >
            Trigger SOS
          </button>
        </div>
      </div>
    </div>
  )
}
