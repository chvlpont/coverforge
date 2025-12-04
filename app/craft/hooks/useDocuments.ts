import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Document } from '@/lib/types/database'
import toast from 'react-hot-toast'

export function useDocuments(user: any) {
  const supabase = createClient()

  const [documents, setDocuments] = useState<Document[]>([])
  const [openDocuments, setOpenDocuments] = useState<Document[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [documentContents, setDocumentContents] = useState<{ [key: string]: string }>({})
  const [documentReferences, setDocumentReferences] = useState<{ [key: string]: string }>({})
  const documentInitialized = useRef<{ [key: string]: boolean }>({})
  const referenceInitialized = useRef<{ [key: string]: boolean }>({})

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

  // Autosave documents content
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    Object.entries(documentContents).forEach(([docId, docContent]) => {
      if (!documentInitialized.current[docId]) {
        documentInitialized.current[docId] = true
        return
      }

      const timer = setTimeout(async () => {
        try {
          const { error } = await supabase
            .from('documents')
            .update({ content: docContent, updated_at: new Date().toISOString() })
            .eq('id', docId)

          if (error) throw error
          setDocuments(docs =>
            docs.map(d => d.id === docId ? { ...d, content: docContent, updated_at: new Date().toISOString() } : d)
          )
        } catch (error: any) {
          console.error('Document autosave failed:', error.message)
        }
      }, 2000)

      timers.push(timer)
    })

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [documentContents, supabase])

  // Autosave document references
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    Object.entries(documentReferences).forEach(([docId, refContent]) => {
      if (!referenceInitialized.current[docId]) {
        referenceInitialized.current[docId] = true
        return
      }

      const timer = setTimeout(async () => {
        try {
          const { error } = await supabase
            .from('documents')
            .update({ reference_content: refContent, updated_at: new Date().toISOString() })
            .eq('id', docId)

          if (error) throw error
          setDocuments(docs =>
            docs.map(d => d.id === docId ? { ...d, reference_content: refContent, updated_at: new Date().toISOString() } : d)
          )
        } catch (error: any) {
          console.error('Reference autosave failed:', error.message)
        }
      }, 2000)

      timers.push(timer)
    })

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [documentReferences, supabase])

  // Create document
  const createDocument = async () => {
    if (!user) return

    try {
      const newDoc = {
        user_id: user.id,
        title: `Document ${documents.length + 1}`,
        content: '',
        reference_content: '',
      }

      const { data, error } = await supabase
        .from('documents')
        .insert([newDoc])
        .select()
        .single()

      if (error) throw error

      setDocuments([data, ...documents])
      setOpenDocuments([...openDocuments, data])
      setDocumentContents({ ...documentContents, [data.id]: '' })
      setDocumentReferences({ ...documentReferences, [data.id]: '' })
      setActiveDocumentId(data.id)
      documentInitialized.current[data.id] = true
      referenceInitialized.current[data.id] = true

      toast.success('Document created!')
    } catch (error: any) {
      toast.error('Failed to create document: ' + error.message)
    }
  }

  // Open document
  const openDocument = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId)
    if (!doc) return

    if (openDocuments.find(d => d.id === documentId)) {
      setActiveDocumentId(documentId)
      toast('Document already open', { icon: 'ℹ️' })
      return
    }

    setOpenDocuments([...openDocuments, doc])
    setDocumentContents({ ...documentContents, [documentId]: doc.content })
    setDocumentReferences({ ...documentReferences, [documentId]: doc.reference_content || '' })
    setActiveDocumentId(documentId)
    documentInitialized.current[documentId] = false
    referenceInitialized.current[documentId] = false
  }

  // Close document
  const closeDocument = (documentId: string) => {
    setOpenDocuments(openDocuments.filter(d => d.id !== documentId))

    const newContents = { ...documentContents }
    delete newContents[documentId]
    setDocumentContents(newContents)

    const newReferences = { ...documentReferences }
    delete newReferences[documentId]
    setDocumentReferences(newReferences)

    if (activeDocumentId === documentId && openDocuments.length > 1) {
      const remaining = openDocuments.filter(d => d.id !== documentId)
      setActiveDocumentId(remaining[0]?.id || null)
    }
  }

  // Update document content
  const updateContent = (documentId: string, content: string) => {
    setDocumentContents({ ...documentContents, [documentId]: content })
  }

  // Update reference content
  const updateReference = (content: string) => {
    if (activeDocumentId) {
      setDocumentReferences({ ...documentReferences, [activeDocumentId]: content })
    }
  }

  // Update document title
  const updateTitle = async (documentId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', documentId)

      if (error) throw error

      setDocuments(docs =>
        docs.map(d => d.id === documentId ? { ...d, title, updated_at: new Date().toISOString() } : d)
      )
      setOpenDocuments(docs =>
        docs.map(d => d.id === documentId ? { ...d, title } : d)
      )
    } catch (error: any) {
      toast.error('Failed to update title: ' + error.message)
    }
  }

  // Save all
  const saveAll = async () => {
    if (openDocuments.length === 0) return 'idle'

    try {
      const promises = openDocuments.map(doc =>
        supabase
          .from('documents')
          .update({
            content: documentContents[doc.id] || '',
            reference_content: documentReferences[doc.id] || '',
            updated_at: new Date().toISOString(),
          })
          .eq('id', doc.id)
      )

      const results = await Promise.all(promises)
      const errors = results.filter(r => r.error)

      if (errors.length > 0) throw new Error('Some documents failed to save')

      toast.success('All documents saved!')
      return 'saved'
    } catch (error: any) {
      toast.error(error.message)
      return 'error'
    }
  }

  return {
    documents,
    openDocuments,
    activeDocumentId,
    documentContents,
    documentReferences,
    setActiveDocumentId,
    createDocument,
    openDocument,
    closeDocument,
    updateContent,
    updateReference,
    updateTitle,
    saveAll,
  }
}
