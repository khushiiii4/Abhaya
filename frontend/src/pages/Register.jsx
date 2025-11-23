import React, { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const { loading, error, token } = useSelector((s) => s.auth)
  const nav = useNavigate()
  const auth = useContext(AuthContext)

  useEffect(() => {
    if (token) nav('/dashboard')
  }, [token])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser({ name, email, password }))
    auth.login({ name, email }, 'demo-token')
    nav('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background: 'linear-gradient(180deg,#fffafc 0%, #fff7fb 50%, #fffdf8 100%)'}}>
      <div className="float-shape float-1 animate-fadeIn"></div>
      <div className="float-shape float-2 animate-fadeIn"></div>
      <div className="float-shape float-3 animate-fadeIn"></div>

      <div className="w-full max-w-md mx-auto p-6 glass-card-strong shadow-2xl rounded-2xl animate-slideUp transition-all duration-500">
        <div className="text-center">
          <img src="/logo.png" alt="Abhaya Logo" className="w-24 mx-auto mb-2" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='/logo.svg.png'}} />
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-600 mb-6">Secure. Strong. Together.</p>
        </div>

        {error && <div className="text-red-500 mb-3 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Full Name" icon="user" type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your full name" />
          <FormInput label="Email" icon="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@domain.com" />
          <FormInput label="Password" icon="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Strong password" />

          <button disabled={loading} type="submit" className="w-full pastel-glow bg-gradient-to-r from-pink-200 via-indigo-100 to-amber-100 text-gray-800 font-semibold py-3 rounded-xl hover:scale-[1.01] transition-transform duration-200">
            <span className="inline-block px-3">{loading ? 'Registering...' : 'Register'}</span>
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium underline">Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
