import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import SOSButton from '../components/SOSButton'
import SOSConfirmModal from '../components/SOSConfirmModal'
import BottomNav from '../components/BottomNav'
import { AuthContext } from '../context/AuthContext'
import axios from '../api/axios'
import socketService from '../services/socketService'

export default function SOS() {
  const { user } = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)
  const [sosData, setSosData] = useState(null)
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/sos/logs')
      setLogs(response.data || [])
    } catch (error) {
      console.error('Failed to fetch SOS logs:', error)
    } finally {
      setLogsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleSOSClick = () => {
    setIsPulsing(true)
    setTimeout(() => {
      setIsPulsing(false)
      setShowModal(true)
    }, 600)
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  const handleConfirm = async () => {
    setIsTriggering(true)
    setShowModal(false)

    try {
      // Get user's current location
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser')
        setIsTriggering(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            // Trigger SOS via backend API
            const response = await axios.post('/sos/trigger', {
              lat: latitude,
              lng: longitude
            })

            // Emit Socket.IO event for real-time alerts
            socketService.triggerSOS({
              userId: user._id,
              userName: user.name,
              lat: latitude,
              lng: longitude
            })

            setSosData(response.data)
            setShowSuccess(true)
            setIsTriggering(false)

            fetchLogs()

            // Auto-hide success message after 8 seconds
            setTimeout(() => {
              setShowSuccess(false)
            }, 8000)

          } catch (error) {
            console.error('SOS trigger failed:', error)
            alert('Failed to trigger SOS. Please try again or call emergency services directly.')
            setIsTriggering(false)
          }
        },
        (error) => {
          console.error('Location error:', error)
          alert('Unable to get your location. Please enable location services and try again.')
          setIsTriggering(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } catch (error) {
      console.error('SOS error:', error)
      setIsTriggering(false)
    }
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
            <div className="relative inline-block">
              {/* Animated pulsing rings */}
              {isPulsing && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-full bg-red-600 animate-pulse"></div>
                </>
              )}
              {/* SOS Button Component or Loading */}
              {isTriggering ? (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center animate-pulse shadow-2xl">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm font-bold">Alerting...</p>
                  </div>
                </div>
              ) : (
                <SOSButton onClick={handleSOSClick} />
              )}
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-8 animate-slideUp shadow-lg">
              <div className="flex items-start justify-center gap-3 text-green-700">
                <FaCheckCircle className="text-3xl animate-bounce flex-shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-lg mb-2">🚨 SOS Alert Sent Successfully!</p>
                  {sosData && sosData.contactsNotified && sosData.contactsNotified.length > 0 ? (
                    <>
                      <p className="text-sm text-green-600 mb-2">
                        ✓ {sosData.contactsNotified.filter(c => c.smsStatus === 'sent').length} emergency contacts notified via SMS
                      </p>
                      <div className="bg-white/60 rounded-lg p-3 mt-2">
                        <p className="text-xs font-semibold text-green-800 mb-1">Contacts Notified:</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          {sosData.contactsNotified.map((contact, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              {contact.smsStatus === 'sent' ? '✅' : '❌'}
                              <span>{contact.name} ({contact.phone})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-green-600">✓ Emergency alert triggered</p>
                  )}
                  <p className="text-sm text-green-600 mt-2">✓ Location shared with contacts</p>
                  <p className="text-sm text-green-600">✓ Real-time alert broadcasted</p>
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

          {/* SOS History */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg text-left animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <h3 className="font-bold text-gray-800 mb-4 text-lg">SOS History</h3>
            {logsLoading ? (
              <p className="text-sm text-gray-600">Loading SOS history...</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-gray-600">No SOS history yet.</p>
            ) : (
              <ul className="space-y-3">
                {logs.map((log) => (
                  <li key={log._id} className="p-3 rounded-2xl bg-white/70 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Status: {log.status}</p>
                      </div>
                      {log.status === 'active' && (
                        <button
                          onClick={async () => {
                            try {
                              await axios.post('/sos/resolve', { sosId: log._id })
                              setLogs((prev) => prev.map((l) => (l._id === log._id ? { ...l, status: 'resolved' } : l)))
                            } catch (error) {
                              alert('Failed to resolve SOS')
                            }
                          }}
                          className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-full hover:bg-green-600"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Location: {log.location?.lat?.toFixed?.(4)}, {log.location?.lng?.toFixed?.(4)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
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

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
