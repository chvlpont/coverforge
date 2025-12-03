'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Document } from '@/lib/types/database'
import Loader from '@/components/Loader'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  // Fetch documents
  useEffect(() => {
    if (!user) return

    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })

        if (error) throw error
        setDocuments(data || [])
      } catch (error: any) {
        toast.error('Failed to load documents: ' + error.message)
      }
    }

    fetchDocuments()
  }, [user, supabase])

  // Create new document
  const handleCreateDocument = async () => {
    if (!user) return

    try {
      setIsCreating(true)
      const newDoc = {
        user_id: user.id,
        title: 'Untitled Document',
        content: '',
        reference_content: '',
      }

      const { data, error } = await supabase
        .from('documents')
        .insert([newDoc])
        .select()
        .single()

      if (error) throw error

      toast.success('Document created!')
      router.push(`/craft?doc=${data.id}`)
    } catch (error: any) {
      toast.error('Failed to create document: ' + error.message)
      setIsCreating(false)
    }
  }

  // Open document
  const handleOpenDocument = (docId: string) => {
    router.push(`/craft?doc=${docId}`)
  }

  // Delete document
  const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)

      if (error) throw error

      setDocuments(documents.filter(d => d.id !== docId))
      toast.success('Document deleted')
    } catch (error: any) {
      toast.error('Failed to delete document: ' + error.message)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My Documents</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Document Button */}
        <button
          onClick={handleCreateDocument}
          disabled={isCreating}
          className="mb-8 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-4 font-medium transition-colors disabled:opacity-50 flex items-center gap-3 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Document
        </button>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-dark-300 mb-2">No documents yet</h3>
            <p className="text-dark-400">Create your first document to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleOpenDocument(doc.id)}
                className="bg-dark-800 border border-dark-700 rounded-lg p-5 hover:border-primary-500 transition-all cursor-pointer group"
              >
                {/* Document Icon */}
                <div className="flex items-start justify-between mb-3">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <button
                    onClick={(e) => handleDeleteDocument(doc.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-500 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Document Info */}
                <h3 className="text-white font-medium text-lg mb-2 truncate">{doc.title}</h3>
                <p className="text-dark-400 text-sm">
                  Last edited {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}