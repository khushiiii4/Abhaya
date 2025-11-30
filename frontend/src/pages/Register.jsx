import React, { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FaGoogle } from 'react-icons/fa'

export default function Register() {
  const [activeTab, setActiveTab] = useState('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const { loading, error, token } = useSelector((s) => s.auth)
  const nav = useNavigate()
  const auth = useContext(AuthContext)

  useEffect(() => {
    if (token) nav('/dashboard')
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (activeTab === 'register' && password !== confirmPassword) {
      alert('Passwords do not match!')
      setIsLoading(false)
      return
    }
    
    setTimeout(() => {
      if (activeTab === 'register') {
        dispatch(registerUser({ name, email, password }))
        auth.login({ name, email }, 'demo-token')
      } else {
        dispatch(registerUser({ email, password }))
        auth.login({ name: email.split('@')[0], email }, 'demo-token')
      }
      setIsLoading(false)
      nav('/dashboard')
    }, 1000)
  }

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked')
    alert('Google Sign In - Integration pending')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5FA] px-4 py-8 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-neumorphic p-8 animate-slideUp">
          
          {/* Logo Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
              <span className="text-white text-4xl font-bold">A</span>
            </div>
          </div>

          {/* App Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-textDark mb-2">Abhaya</h1>
            <p className="text-gray-500 text-sm font-light">Secure. Strong. Together.</p>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-gradient-primary text-white shadow-soft'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-gradient-primary text-white shadow-soft'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-center text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input - Only for Register */}
            {activeTab === 'register' && (
              <div className="animate-slideUp">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={activeTab === 'register'}
                  className="w-full px-4 py-3.5 bg-[#F7F7F8] border-transparent rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-neumorphic-inset"
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-[#F7F7F8] border-transparent rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-neumorphic-inset"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-[#F7F7F8] border-transparent rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-neumorphic-inset"
              />
            </div>

            {/* Confirm Password - Only for Register */}
            {activeTab === 'register' && (
              <div className="animate-slideUp">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={activeTab === 'register'}
                  className="w-full px-4 py-3.5 bg-[#F7F7F8] border-transparent rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-neumorphic-inset"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-white font-bold py-3.5 px-6 rounded-xl shadow-soft hover:opacity-90 hover:scale-105 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{activeTab === 'login' ? 'Logging in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Forgot Password - Only for Login */}
          {activeTab === 'login' && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => alert('Forgot Password - Feature coming soon')}
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-neumorphic"
          >
            <FaGoogle className="text-red-500" size={18} />
            Sign in with Google
          </button>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">Authenticated as: Anonymous</p>
          </div>
        </div>

        {/* Additional Navigation */}
        <div className="text-center mt-6 animate-fadeIn">
          <p className="text-sm text-gray-600">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-primary font-bold hover:underline"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-primary font-bold hover:underline"
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
