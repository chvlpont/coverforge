'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MasterLetter } from '@/lib/types/database'
import Loader from '@/components/Loader'
import DocumentEditor from '@/components/craft/DocumentEditor'
import AIAssistant from '@/components/craft/AIAssistant'
import ReferenceDocument from '@/components/craft/ReferenceDocument'
import toast from 'react-hot-toast'

export default function CraftPage() {
  const router = useRouter()
  const supabase = createClient()

  // Auth & data state
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [masterLetters, setMasterLetters] = useState<MasterLetter[]>([])
  const [selectedLetterId, setSelectedLetterId] = useState<string>('')

  // Editor state
  const [content, setContent] = useState('')
  const [referenceContent, setReferenceContent] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [selections, setSelections] = useState<{ id: string; text: string }[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Check auth
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  // Fetch master letters
  useEffect(() => {
    if (!user) return

    const fetchMasterLetters = async () => {
      try {
        const { data, error } = await supabase
          .from('master_letters')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setMasterLetters(data || [])

        // Auto-select first letter if available
        if (data && data.length > 0 && !selectedLetterId) {
          setSelectedLetterId(data[0].id)
          setContent(data[0].content)
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    }

    fetchMasterLetters()
  }, [user, supabase])

  // Handle master letter change
  const handleLetterChange = (letterId: string) => {
    const letter = masterLetters.find(l => l.id === letterId)
    if (letter) {
      setSelectedLetterId(letterId)
      setContent(letter.content)
      setSelectedText('')
      setSelections([])
    }
  }

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  // Handle text selection
  const handleTextSelect = (text: string) => {
    setSelectedText(text)
  }

  // Handle add selection
  const handleAddSelection = () => {
    if (!selectedText.trim()) return

    const newSelection = {
      id: Date.now().toString(),
      text: selectedText,
    }

    setSelections([...selections, newSelection])
    setSelectedText('')
  }

  // Handle remove selection
  const handleRemoveSelection = (id: string) => {
    setSelections(selections.filter((s) => s.id !== id))
  }

  // Handle apply AI changes
  const handleApplyChanges = (modifications: { original: string; modified: string }[]) => {
    let newContent = content

    // Replace all original texts with modified texts
    modifications.forEach((mod) => {
      newContent = newContent.replace(mod.original, mod.modified)
    })

    setContent(newContent)
    setSelections([])
    setSelectedText('')
    toast.success(`Applied ${modifications.length} change(s)!`)
  }

  // Handle save
  const handleSave = async () => {
    if (!selectedLetterId) return

    try {
      const { error } = await supabase
        .from('master_letters')
        .update({ content })
        .eq('id', selectedLetterId)

      if (error) throw error
      toast.success('Saved successfully!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return <Loader />
  }

  const selectedLetter = masterLetters.find(l => l.id === selectedLetterId)

  return (
    <div className="h-screen flex flex-col bg-dark-950">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Craft</h1>

          {/* Master Letter Selector */}
          <select
            value={selectedLetterId}
            onChange={(e) => handleLetterChange(e.target.value)}
            className="bg-dark-700 text-white border border-dark-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="">Select a master letter</option>
            {masterLetters.map((letter) => (
              <option key={letter.id} value={letter.id}>
                {letter.title} ({letter.language})
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!selectedLetterId}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Save
        </button>
      </div>

      {/* Main Content */}
      {!selectedLetter ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-dark-400">
            <p className="text-lg mb-2">No master letter selected</p>
            <p className="text-sm">Select a master letter from the header to get started</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Reference Document Sidebar */}
          <ReferenceDocument
            content={referenceContent}
            onContentChange={setReferenceContent}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Center: Document Editor */}
          <div className="flex-1">
            <DocumentEditor
              content={content}
              onContentChange={handleContentChange}
              onTextSelect={handleTextSelect}
              selections={selections}
              onRemoveSelection={handleRemoveSelection}
            />
          </div>

          {/* Right: AI Assistant */}
          <div className="w-96">
            <AIAssistant
              selectedText={selectedText}
              selections={selections}
              onAddSelection={handleAddSelection}
              onRemoveSelection={handleRemoveSelection}
              onApplyChanges={handleApplyChanges}
              referenceContent={referenceContent}
              language={selectedLetter.language}
            />
          </div>
        </div>
      )}
    </div>
  )
}
