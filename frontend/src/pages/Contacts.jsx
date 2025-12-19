import React, { useState, useEffect } from 'react'
import { Users, Phone, Plus, Trash2, X, MapPin, Shield, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

export default function Contacts() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch contacts from backend
  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts')
      setContacts(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setLoading(false)
    }
  }

  const handleAddContact = async (e) => {
    e.preventDefault()
    setPhoneError('')

    if (!/^\d{10}$/.test(formData.phone)) {
      setPhoneError('Phone must be exactly 10 digits')
      return
    }

    try {
      const response = await axios.post('/contacts', {
        name: formData.name,
        phone: formData.phone,
      })
      
      setContacts([...contacts, response.data])
      setFormData({ name: '', phone: '' })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding contact:', error)
      alert('Failed to add contact. Please try again.')
    }
  }

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`/contacts/${id}`)
        setContacts(contacts.filter(c => c._id !== id))
      } catch (error) {
        console.error('Error deleting contact:', error)
        alert('Failed to delete contact. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C471ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="glass-card rounded-none border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glass">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-heading">Emergency Contacts</h1>
                <p className="text-sm text-text-secondary">{contacts.length} trusted contacts</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-12 h-12 rounded-full bg-gradient-primary hover:shadow-glass flex items-center justify-center transition-all"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {contacts.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 border border-white/40 text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glass">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-text-heading mb-2">No Contacts Yet</h3>
            <p className="text-text-secondary mb-6">Add trusted contacts who will be notified during emergencies</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-primary hover:shadow-glass rounded-2xl text-white font-semibold transition-all"
            >
              Add Your First Contact
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div key={contact._id || contact.id} className="glass-card rounded-3xl p-4 border border-white/40 hover:bg-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">{contact.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-text-heading">{contact.name}</h3>
                      <p className="text-sm text-text-secondary flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteContact(contact._id || contact.id)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-100 flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-xs text-text-muted">
                    Added: {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative glass-card rounded-3xl p-6 border border-white/40 max-w-md w-full animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-heading">Add Emergency Contact</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter contact name"
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-text-heading placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit phone number"
                  required
                  maxLength="10"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-text-heading placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl text-text-secondary font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-primary hover:shadow-glass rounded-2xl text-white font-semibold transition-all"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Glassmorphism Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card rounded-3xl border border-white/40">
            <div className="flex items-center justify-around py-3 px-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Dashboard</span>
              </button>

              <button
                onClick={() => navigate('/safe-zones')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Safe Zones</span>
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Reports</span>
              </button>

              <button
                onClick={() => navigate('/contacts')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-gradient-primary/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold bg-gradient-primary bg-clip-text text-transparent">Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
