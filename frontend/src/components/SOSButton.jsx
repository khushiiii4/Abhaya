import React from 'react'

export default function SOSButton({ onClick }) {
  return (
    <div className="relative inline-block">
      {/* Glowing halo effect */}
      <div className="absolute inset-0 rounded-full bg-red-500/50 blur-3xl animate-pulse"></div>
      
      {/* Main SOS Button */}
      <button
        onClick={onClick}
        className="relative w-[200px] h-[200px] rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-5xl shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
        aria-label="Emergency SOS Button"
      >
        SOS
      </button>
    </div>
  )
}
