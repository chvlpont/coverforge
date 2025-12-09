'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const isOnDashboard = pathname === '/dashboard'

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDashboardClick = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Coverforge
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  {!isOnDashboard && (
                    <button
                      onClick={handleDashboardClick}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-gray-900 rounded-lg font-semibold transition-all cursor-pointer"
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 text-gray-900 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-gray-600 hover:text-gray-900 font-semibold transition-colors cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-all cursor-pointer"
                  >
                    Register
                  </button>
                </>
              )}
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
