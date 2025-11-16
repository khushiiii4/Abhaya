import React from 'react'
import { FaUser, FaPhone, FaTrash } from 'react-icons/fa'

export default function ContactCard({ contact, onDelete }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-md">
            <FaUser className="text-lg" />
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-800">{contact.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <FaPhone className="text-xs" />
              <span>{contact.phone}</span>
            </div>
          </div>
        </div>
        
        {/* Delete Button */}
        <button
          onClick={() => onDelete(contact.id)}
          className="p-3 bg-red-50 hover:bg-red-100 rounded-full transition-colors group"
          aria-label="Delete contact"
        >
          <FaTrash className="text-red-500 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  )
}
