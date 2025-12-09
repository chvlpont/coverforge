'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  if (!isOpen) return null

  const validateUsername = (username: string) => {
    // Username must be 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleUsernameBlur = () => {
    if (username && !validateUsername(username)) {
      toast.error('Username must be 3-20 characters (letters, numbers, underscores)')
    }
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      toast.error('Please enter a valid email address')
    }
  }

  const handlePasswordBlur = () => {
    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters')
    }
  }

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password && confirmPassword !== password) {
      toast.error('Passwords do not match')
    }
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate before submitting
    if (!username) {
      toast.error('Please enter a username')
      return
    }

    if (!validateUsername(username)) {
      toast.error('Username must be 3-20 characters (letters, numbers, underscores)')
      return
    }

    if (!email) {
      toast.error('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!password) {
      toast.error('Please enter a password')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!confirmPassword) {
      toast.error('Please confirm your password')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // First, check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (existingUser) {
        toast.error('Username is already taken')
        setLoading(false)
        return
      }

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      })

      if (authError) throw authError

      // Create profile entry
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username,
            email: email,
          })

        if (profileError) throw profileError
      }

      toast.success('Account created successfully!')

      // Clear form and switch to login
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        onSwitchToLogin()
      }, 1500)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h2>

          {/* Email/Password Register */}
          <form onSubmit={handleEmailRegister} noValidate className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={handleUsernameBlur}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 autofill:bg-white autofill:text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 autofill:bg-white autofill:text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 autofill:bg-white autofill:text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 autofill:bg-white autofill:text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-black text-white rounded-lg font-bold text-lg transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
