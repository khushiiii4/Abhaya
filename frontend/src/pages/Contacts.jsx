import React, { useState, useEffect } from 'react'
import { FaPlus, FaPhone, FaUser } from 'react-icons/fa'
import Modal from '../components/Modal'
import ContactCard from '../components/ContactCard'
// import axios from '../api/axios' // Uncomment for Day 7 backend integration

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })

  // TODO: Replace with backend GET /api/contacts on Day 7
  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with real backend call on Day 7
      // const { data } = await axios.get("/api/contacts")
      // setContacts(data.contacts)
      
      // Temporary: Using localStorage for demo
      const savedContacts = localStorage.getItem('emergencyContacts')
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts))
      }
      
      setLoading(false)
    } catch (err) {
      setError('Failed to load contacts')
      setLoading(false)
      console.error(err)
    }
  }

  const handleAddContact = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      
      // TODO: Integrate POST /api/contacts on Day 7
      // const { data } = await axios.post("/api/contacts", formData)
      // setContacts([...contacts, data.contact])
      
      // Temporary: Using local state
      const newContact = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        createdAt: new Date().toISOString()
      }
      
      const updatedContacts = [...contacts, newContact]
      setContacts(updatedContacts)
      localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
      
      setFormData({ name: '', phone: '' })
      setIsModalOpen(false)
      setLoading(false)
    } catch (err) {
      setError('Failed to add contact')
      setLoading(false)
      console.error(err)
    }
  }

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return
    }

    try {
      setLoading(true)
      
      // TODO: Integrate DELETE /api/contacts/:id on Day 7
      // await axios.delete(`/api/contacts/${id}`)
      
      // Temporary: Using local state
      const updatedContacts = contacts.filter(c => c.id !== id)
      setContacts(updatedContacts)
      localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
      
      setLoading(false)
    } catch (err) {
      setError('Failed to delete contact')
      setLoading(false)
      console.error(err)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Emergency Contacts</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your trusted contacts</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        {/* Add Contact Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mb-6"
        >
          <FaPlus />
          <span>Add Emergency Contact</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        )}

        {/* Contacts List */}
        {!loading && contacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No contacts yet</h3>
            <p className="text-gray-500 text-sm">Add your first emergency contact to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}

        {/* Helper Text */}
        {contacts.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Quick Tip</p>
                <p className="text-xs text-blue-700 mt-1">
                  These contacts will be alerted when you trigger the SOS button. Make sure their phone numbers are correct.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Emergency Contact"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-gray-400" />
              Contact Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter contact name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-gray-400" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
