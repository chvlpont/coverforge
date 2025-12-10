import { Clock, Zap, Target } from 'lucide-react'
import Button from '@/components/Button'
import LoginModal from '../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Hero() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative background elements - Black & White theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main hero content - takes up full viewport on mobile */}
        <div className="min-h-screen flex items-center justify-center py-20 sm:py-24">
          <div className="text-center w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-8 sm:mb-10 shadow-lg">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Writing Assistant</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 sm:mb-8 tracking-tight px-2 leading-tight">
              <span className="block mb-2">AI-Powered Document</span>
              <span className="block relative">
                <span className="relative inline-block">
                  Editor
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-gray-900 -z-10"></span>
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Create multiple documents with AI assistance. Upload reference materials and let AI help you write while staying true to your sources.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button
                onClick={() => isLoggedIn ? router.push('/dashboard') : setIsLoginModalOpen(true)}
                className="cursor-pointer w-full sm:w-auto min-w-[220px] bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-full"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Creating Free'}
              </Button>
            </div>

            {/* Scroll indicator for mobile */}
            <div className="mt-16 sm:mt-20 block sm:hidden">
              <div className="flex flex-col items-center gap-2 text-gray-400 animate-bounce">
                <span className="text-sm">Scroll to explore</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards - appears below the fold on mobile */}
        <div className="pb-20 sm:pb-32">
          {/* Section header */}
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Everything you need</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Powerful features designed to enhance your writing workflow</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-6xl mx-auto px-4">
            {/* Card 1 - Multiple Documents */}
            <div className="group relative bg-white p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-black overflow-hidden hover:-translate-y-3">
              {/* Number badge */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm group-hover:bg-black group-hover:text-white transition-all duration-300">
                01
              </div>

              {/* Background decoration */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-black to-gray-800 text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Clock className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3 group-hover:text-gray-900 transition-colors">Multiple Documents</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-4">Work on several documents simultaneously with seamless switching and organization</p>
                <div className="w-12 h-1 bg-black transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>

            {/* Card 2 - AI-Powered */}
            <div className="group relative bg-black text-white p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-black hover:border-gray-900 overflow-hidden hover:-translate-y-3 sm:scale-105">
              {/* Number badge */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-bold text-sm group-hover:bg-white group-hover:text-black transition-all duration-300">
                02
              </div>

              {/* Background decoration */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white text-black mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Zap className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">AI-Powered Suggestions</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-4">Get intelligent writing suggestions that understand context and enhance your content</p>
                <div className="w-12 h-1 bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>

            {/* Card 3 - Reference Tracking */}
            <div className="group relative bg-white p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-black overflow-hidden hover:-translate-y-3">
              {/* Number badge */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm group-hover:bg-black group-hover:text-white transition-all duration-300">
                03
              </div>

              {/* Background decoration */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-black to-gray-800 text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Target className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3 group-hover:text-gray-900 transition-colors">Reference Tracking</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-4">Track and cite your sources easily with intelligent reference management</p>
                <div className="w-12 h-1 bg-black transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false)
            setIsRegisterModalOpen(true)
          }}
        />
      )}
      {isRegisterModalOpen && (
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false)
            setIsLoginModalOpen(true)
          }}
        />
      )}
    </section>
  )
}
