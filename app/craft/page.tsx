'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/Loader'
import TabbedEditor from '@/components/craft/TabbedEditor'
import AIAssistant from '@/components/craft/AIAssistant'
import Sidebar from '@/components/craft/Sidebar'
import { useDocuments } from './hooks/useDocuments'
import toast from 'react-hot-toast'

export default function CraftPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedText, setSelectedText] = useState('')
  const [selections, setSelections] = useState<{ id: string; text: string }[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [aiAssistantWidth, setAIAssistantWidth] = useState(384)
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false)
  const [isDraggingAI, setIsDraggingAI] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)

  const docs = useDocuments(user)

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

  // Auto-open document from URL
  useEffect(() => {
    const docId = searchParams.get('doc')
    if (docId && docs.documents.length > 0) {
      const doc = docs.documents.find(d => d.id === docId)
      if (doc && !docs.openDocuments.find(d => d.id === docId)) {
        docs.openDocument(docId)
      }
    }
  }, [searchParams, docs.documents])

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
    if (!docs.activeDocumentId) return

    let newContent = docs.documentContents[docs.activeDocumentId] || ''
    modifications.forEach((mod) => {
      newContent = newContent.replace(mod.original, mod.modified)
    })

    docs.updateContent(docs.activeDocumentId, newContent)
    setSelections([])
    setSelectedText('')
    toast.success(`Applied ${modifications.length} change(s)!`)
  }

  // Handle title edit
  const handleTitleClick = () => {
    if (docs.activeDocumentId) {
      const activeDoc = docs.openDocuments.find(d => d.id === docs.activeDocumentId)
      if (activeDoc) {
        setEditedTitle(activeDoc.title)
        setIsEditingTitle(true)
      }
    }
  }

  const handleTitleBlur = () => {
    if (docs.activeDocumentId && editedTitle.trim()) {
      docs.updateTitle(docs.activeDocumentId, editedTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (docs.activeDocumentId && editedTitle.trim()) {
        docs.updateTitle(docs.activeDocumentId, editedTitle.trim())
      }
      setIsEditingTitle(false)
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  // Get current title
  const currentTitle = docs.activeDocumentId
    ? docs.openDocuments.find(d => d.id === docs.activeDocumentId)?.title || 'Craft'
    : 'Craft'

  // Handle sidebar resize
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSidebar(true)
    setDragStartX(e.clientX)
    setDragStartWidth(sidebarWidth)
  }

  const handleAIMouseDown = (e: React.MouseEvent) => {
    setIsDraggingAI(true)
    setDragStartX(e.clientX)
    setDragStartWidth(aiAssistantWidth)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSidebar) {
        const delta = e.clientX - dragStartX
        const newWidth = Math.max(200, Math.min(600, dragStartWidth + delta))
        setSidebarWidth(newWidth)
      }
      if (isDraggingAI) {
        const delta = dragStartX - e.clientX
        const newWidth = Math.max(300, Math.min(700, dragStartWidth + delta))
        setAIAssistantWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingSidebar(false)
      setIsDraggingAI(false)
    }

    if (isDraggingSidebar || isDraggingAI) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDraggingSidebar, isDraggingAI, dragStartX, dragStartWidth])

  if (loading) return <Loader />

  return (
    <div className="h-screen flex flex-col bg-dark-950">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="text-xl font-bold text-white bg-transparent border-none outline-none focus:outline-none px-0 py-0"
              style={{ width: `${Math.max(editedTitle.length * 12, 60)}px` }}
            />
          ) : (
            <h1
              onClick={handleTitleClick}
              className={`text-xl font-bold text-white ${docs.activeDocumentId ? 'cursor-pointer hover:bg-dark-700 px-2 py-1 rounded transition-colors' : ''}`}
              title={docs.activeDocumentId ? 'Click to edit' : ''}
            >
              {currentTitle}
            </h1>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Sidebar */}
        <Sidebar
          content={docs.activeDocumentId ? (docs.documentReferences[docs.activeDocumentId] || '') : ''}
          onContentChange={docs.updateReference}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          documents={docs.documents}
          onSelectDocument={docs.openDocument}
          onCreateDocument={docs.createDocument}
          width={sidebarWidth}
        />

        {/* Sidebar Resize Handle */}
        {!isSidebarCollapsed && (
          <div
            onMouseDown={handleSidebarMouseDown}
            className={`w-1 hover:w-1 cursor-col-resize flex-shrink-0 transition-colors ${
              isDraggingSidebar ? 'bg-blue-500' : 'bg-dark-700 hover:bg-blue-500'
            }`}
          />
        )}

        {/* Center: Tabbed Editor or Empty State */}
        {docs.openDocuments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-dark-900">
            <div className="text-center text-dark-400">
              <svg className="w-24 h-24 mx-auto mb-4 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl mb-2">No documents open</p>
              <p className="text-sm">Create or open a document from the sidebar to get started</p>
            </div>
          </div>
        ) : (
          <TabbedEditor
            openDocuments={docs.openDocuments}
            activeDocumentId={docs.activeDocumentId}
            documentContents={docs.documentContents}
            onDocumentContentChange={docs.updateContent}
            onActiveDocumentChange={docs.setActiveDocumentId}
            onCloseDocument={docs.closeDocument}
            onTextSelect={handleTextSelect}
            selections={selections}
            onRemoveSelection={handleRemoveSelection}
          />
        )}

        {/* AI Assistant Resize Handle */}
        <div
          onMouseDown={handleAIMouseDown}
          className={`w-1 hover:w-1 cursor-col-resize flex-shrink-0 transition-colors ${
            isDraggingAI ? 'bg-blue-500' : 'bg-dark-700 hover:bg-blue-500'
          }`}
        />

        {/* Right: AI Assistant */}
        <div style={{ width: aiAssistantWidth }} className="flex-shrink-0">
          <AIAssistant
            selectedText={selectedText}
            selections={selections}
            onAddSelection={handleAddSelection}
            onRemoveSelection={handleRemoveSelection}
            onApplyChanges={handleApplyChanges}
            referenceContent={docs.activeDocumentId ? (docs.documentReferences[docs.activeDocumentId] || '') : ''}
            language="EN"
          />
        </div>
      </div>
    </div>
  )
}
