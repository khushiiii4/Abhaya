import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import SOSButton from '../components/SOSButton'
import SOSConfirmModal from '../components/SOSConfirmModal'

export default function SOS() {
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSOSClick = () => {
    setShowModal(true)
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  const handleConfirm = () => {
    // TODO: Backend integration for Day 7
    // await axios.post('/api/sos/trigger', { location, timestamp })
    
    console.log('SOS Triggered')
    console.log('Emergency alert sent to contacts')
    console.log('Location sharing activated')
    
    setShowModal(false)
    setShowSuccess(true)
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Emergency SOS</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-2xl">
          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-800 mb-3 animate-slideUp">
            Emergency SOS
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-red-700 font-semibold mb-12 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Press only in real emergency
          </p>

          {/* SOS Button */}
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <SOSButton onClick={handleSOSClick} />
          </div>

          {/* Instructions */}
          <p className="text-gray-600 text-lg mb-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            Click the button above to trigger emergency alert
          </p>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-8 animate-slideUp shadow-lg">
              <div className="flex items-center justify-center gap-3 text-green-700">
                <FaCheckCircle className="text-3xl" />
                <div className="text-left">
                  <p className="font-bold text-lg">SOS Alert Triggered!</p>
                  <p className="text-sm text-green-600">Emergency contacts have been notified</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg text-left animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-bold text-gray-800 mb-4 text-lg">What happens when triggered?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span>Instant SMS/call alerts sent to emergency contacts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span>Live location shared with contacts and authorities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span>Automatic audio recording starts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span>Nearby app users are alerted</span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> False alarms may delay help for real emergencies. Use responsibly.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <SOSConfirmModal
        isOpen={showModal}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
