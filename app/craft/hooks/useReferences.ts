import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Reference } from '@/lib/types/database'
import toast from 'react-hot-toast'

export function useReferences(user: any) {
  const supabase = createClient()

  const [references, setReferences] = useState<Reference[]>([])
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(null)
  const [referenceContent, setReferenceContent] = useState('')

  // Fetch references
  useEffect(() => {
    if (!user) return

    const fetchReferences = async () => {
      try {
        const { data, error } = await supabase
          .from('references')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })

        if (error) throw error
        setReferences(data || [])
      } catch (error: any) {
        toast.error('Failed to load references: ' + error.message)
      }
    }

    fetchReferences()
  }, [user, supabase])

  // Update content when selected reference changes
  useEffect(() => {
    if (selectedReferenceId) {
      const ref = references.find(r => r.id === selectedReferenceId)
      if (ref) {
        setReferenceContent(ref.content)
      }
    } else {
      setReferenceContent('')
    }
  }, [selectedReferenceId, references])

  // Create reference
  const createReference = async () => {
    if (!user) return

    try {
      const newRef = {
        user_id: user.id,
        title: `Reference ${references.length + 1}`,
        content: '',
      }

      const { data, error } = await supabase
        .from('references')
        .insert([newRef])
        .select()
        .single()

      if (error) throw error

      setReferences([data, ...references])
      setSelectedReferenceId(data.id)
      toast.success('Reference created!')
    } catch (error: any) {
      toast.error('Failed to create reference: ' + error.message)
    }
  }

  // Select reference
  const selectReference = (referenceId: string) => {
    setSelectedReferenceId(referenceId || null)
  }

  // Update content
  const updateContent = (content: string) => {
    setReferenceContent(content)
  }

  // Save content (with debouncing handled by component)
  const saveContent = async () => {
    if (!selectedReferenceId) return

    try {
      const { error } = await supabase
        .from('references')
        .update({ content: referenceContent, updated_at: new Date().toISOString() })
        .eq('id', selectedReferenceId)

      if (error) throw error

      setReferences(refs =>
        refs.map(r => r.id === selectedReferenceId ? { ...r, content: referenceContent, updated_at: new Date().toISOString() } : r)
      )
    } catch (error: any) {
      console.error('Reference save failed:', error.message)
    }
  }

  // Update title
  const updateTitle = async (referenceId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('references')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', referenceId)

      if (error) throw error

      setReferences(refs =>
        refs.map(r => r.id === referenceId ? { ...r, title, updated_at: new Date().toISOString() } : r)
      )
    } catch (error: any) {
      toast.error('Failed to update title: ' + error.message)
    }
  }

  return {
    references,
    selectedReferenceId,
    referenceContent,
    createReference,
    selectReference,
    updateContent,
    saveContent,
    updateTitle,
  }
}
