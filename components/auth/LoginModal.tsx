'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  if (!isOpen) return null

  const handlePasswordBlur = () => {
    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters')
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate before submitting
    if (!emailOrUsername) {
      toast.error('Please enter your email or username')
      return
    }

    if (!password) {
      toast.error('Please enter your password')
      return
    }

    setLoading(true)

    try {
      let loginEmail = emailOrUsername

      // Check if input is a username (doesn't contain @)
      if (!emailOrUsername.includes('@')) {
        // Query profiles table to get email from username
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', emailOrUsername)
          .single()

        if (profileError || !profile) {
          toast.error('Username not found')
          setLoading(false)
          return
        }

        loginEmail = profile.email
      }

      // Sign in with email
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      })

      if (error) throw error

      toast.success('Successfully logged in!')
      onClose()
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md relative">
        <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h2>

          {/* Email/Password Login */}
          <form onSubmit={handleEmailLogin} noValidate className="space-y-4">
            <div>
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-dark-100 mb-2">
                Email or Username
              </label>
              <input
                id="emailOrUsername"
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-100 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-dark-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary-500 hover:text-primary-400 font-semibold cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
