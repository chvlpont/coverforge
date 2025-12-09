'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Document } from '@/lib/types/database'
import Loader from '@/components/Loader'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'

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

  // Get text preview from HTML content
  const getTextPreview = (htmlContent: string) => {
    if (!htmlContent) return 'Start writing...'
    // Remove HTML tags and clean up whitespace
    const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return text
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Content */}
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium text-gray-900">My Documents</h1>
          {/* Create New Document Button */}
          <button
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Document
          </button>
        </div>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No documents yet</h3>
            <p className="text-gray-500">Create your first document to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleOpenDocument(doc.id)}
                className="group cursor-pointer"
              >
                {/* Document Preview */}
                <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all mb-3">
                  {/* Preview Content */}
                  <div className="aspect-[8.5/11] p-6 bg-white border-b border-gray-100">
                    <div className="text-xs text-gray-700 line-clamp-[14] leading-relaxed">
                      {getTextPreview(doc.content)}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteDocument(doc.id, e)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-all"
                  >
                    <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Document Info */}
                <div className="px-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Edited {new Date(doc.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}