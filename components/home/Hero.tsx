import { Clock, Zap, Target } from 'lucide-react'
import Button from '@/components/Button'
import LoginModal from '../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'
import { useState } from 'react'

export default function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            AI-Powered Document{' '}
            <span className="text-primary-600">
              Editor
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create multiple documents with AI assistance. Upload reference materials and let AI help you write while staying true to your sources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => setIsLoginModalOpen(true)}>Start Creating</Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600 mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">Multiple</div>
            <div className="text-gray-600">Documents</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600 mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">AI-Powered</div>
            <div className="text-gray-600">Suggestions</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600 mb-3">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">Reference</div>
            <div className="text-gray-600">Tracking</div>
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
