import React from 'react'

function Icon({ name }){
  if (name === 'user') return (
    <svg className="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
  )
  if (name === 'email') return (
    <svg className="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0l-4 4m4-4l-4-4M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8"/></svg>
  )
  return (
    <svg className="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0a3 3 0 11-6 0 3 3 0 016 0zM3 21v-2a4 4 0 014-4h.5"/></svg>
  )
}

export default function FormInput({ label, icon='email', type='text', value, onChange, placeholder }){
  return (
    <label className="block">
      <span className="text-sm text-gray-700 mb-1 block">{label}</span>
      <div className="flex items-center gap-3 bg-white/60 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-300">
        <div className="flex-shrink-0">
          <Icon name={icon} />
        </div>
        <input
          className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </label>
  )
}
