import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SOS from './pages/SOS'
import Contacts from './pages/Contacts'
import Reports from './pages/Reports'
import SafeZones from './pages/SafeZones'
import Profile from './pages/Profile'
import Map from './pages/Map'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/sos" element={
        <ProtectedRoute>
          <SOS />
        </ProtectedRoute>
      } />

      <Route path="/contacts" element={
        <ProtectedRoute>
          <Contacts />
        </ProtectedRoute>
      } />

      <Route path="/map" element={
        <ProtectedRoute>
          <Map />
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />

      <Route path="/safe-zones" element={
        <ProtectedRoute>
          <SafeZones />
        </ProtectedRoute>
      } />

      <Route path="/zones" element={
        <ProtectedRoute>
          <SafeZones />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace/>} />
    </Routes>
  )
}
