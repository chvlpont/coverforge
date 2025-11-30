'use client'

import { useState } from 'react'
import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-sm border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Coverforge
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-dark-100 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-6 py-2 bg-white hover:bg-gray-100 text-black rounded-lg font-bold transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}
