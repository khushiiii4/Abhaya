import React, { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser } from '../redux/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FaGoogle } from 'react-icons/fa'

export default function Login() {
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
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
    
    try {
      let result
      if (activeTab === 'register') {
        // Register new user
        result = await dispatch(registerUser({ name, email, phone: phone || '0000000000', password })).unwrap()
      } else {
        // Login existing user
        result = await dispatch(loginUser({ email, password })).unwrap()
      }
      
      // Login to AuthContext with real token and user data
      auth.login(result, result.token)
      setIsLoading(false)
      nav('/dashboard')
    } catch (err) {
      console.error('Auth error:', err)
      alert(err || 'Authentication failed. Please try again.')
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked')
    alert('Google Sign In - Integration pending')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-bg px-4 py-8 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Main Card - Glassmorphism */}
        <div className="glass-card rounded-[40px] border-4 border-white/40 p-8 animate-slideUp">
          
          {/* Logo Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glass border-4 border-white/30">
              <span className="text-white text-3xl font-bold">A</span>
            </div>
          </div>

          {/* App Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Abhaya</h1>
            <p className="text-white/80 text-sm">Secure. Strong. Together.</p>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 mb-6 bg-white/20 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-white/90 text-text-heading shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-white/90 text-text-heading shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-400/20 border border-red-300/40 text-white px-4 py-3 rounded-2xl mb-4 text-center text-sm font-medium backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-3 bg-white/25 border border-white/30 rounded-2xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
                />
              </div>
            )}

            {/* Phone Input - Only for Register */}
            {activeTab === 'register' && (
              <div className="animate-slideUp">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="[0-9]{10}"
                  required={activeTab === 'register'}
                  className="w-full px-4 py-3 bg-white/25 border border-white/30 rounded-2xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
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
                className="w-full px-4 py-3 bg-white/25 border border-white/30 rounded-2xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/25 border border-white/30 rounded-2xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
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
                  className="w-full px-4 py-3 bg-white/25 border border-white/30 rounded-2xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all backdrop-blur-sm"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-white font-bold py-3 px-6 rounded-2xl shadow-glass hover:shadow-xl hover:scale-105 transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => alert('Forgot Password - Feature coming soon')}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-white/30"></div>
            <span className="text-sm text-white/70 font-medium">OR</span>
            <div className="flex-1 h-px bg-white/30"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/90 border border-white/40 rounded-2xl font-semibold text-text-heading hover:bg-white transition-all shadow-md text-sm"
          >
            <FaGoogle className="text-red-500" size={16} />
            Sign in with Google
          </button>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-white/60">Forgot Password?</p>
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
