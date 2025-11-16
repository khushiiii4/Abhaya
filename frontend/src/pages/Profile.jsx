import React from 'react'
import Navbar from '../components/Navbar'

export default function Profile(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-600 mt-2">Placeholder for Profile page.</p>
      </main>
    </div>
  )
}
