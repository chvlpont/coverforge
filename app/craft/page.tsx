'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/Loader'
import TabbedEditor from '@/components/craft/TabbedEditor'
import AIAssistant from '@/components/craft/AIAssistant'
import Sidebar from '@/components/craft/Sidebar'
import { useDocuments } from './hooks/useDocuments'
import { useReferences } from './hooks/useReferences'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import toast from 'react-hot-toast'

function CraftPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { theme, toggleTheme } = useTheme()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedText, setSelectedText] = useState('')
  const [selections, setSelections] = useState<{ id: string; text: string }[]>([])
  const [pendingModifications, setPendingModifications] = useState<{ id: string; original: string; modified: string }[]>([])
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
  const refs = useReferences(user)

  // Autosave reference content
  useEffect(() => {
    if (!refs.selectedReferenceId || !refs.referenceContent) return

    const timer = setTimeout(() => {
      refs.saveContent()
    }, 2000)

    return () => clearTimeout(timer)
  }, [refs.referenceContent, refs.selectedReferenceId])

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

  // Handle text selection - auto-add to selections
  const handleTextSelect = (text: string) => {
    if (!text.trim()) return

    // Check if this text is already in selections
    const alreadyExists = selections.some(s => s.text === text)
    if (alreadyExists) return

    const newSelection = {
      id: Date.now().toString(),
      text: text,
    }

    setSelections([...selections, newSelection])
    setSelectedText(text)
  }

  // Handle add selection (kept for compatibility, but now handled by handleTextSelect)
  const handleAddSelection = () => {
    // This is now handled automatically in handleTextSelect
  }

  // Handle remove selection
  const handleRemoveSelection = (id: string) => {
    setSelections(selections.filter((s) => s.id !== id))
  }

  // Helper to strip HTML tags
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Handle apply AI changes - now applies as preview with pending modifications
  const handleApplyChanges = (modifications: { original: string; modified: string }[]) => {
    if (!docs.activeDocumentId) return

    let newContent = docs.documentContents[docs.activeDocumentId] || ''

    // Check if content is HTML or plain text
    const isHtmlContent = newContent.includes('<') && newContent.includes('>')

    if (isHtmlContent) {
      // For HTML content, we need to be more careful
      // Create a temporary div to manipulate the HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = newContent

      modifications.forEach((mod) => {
        // Get all text nodes
        const walker = document.createTreeWalker(
          tempDiv,
          NodeFilter.SHOW_TEXT,
          null
        )

        const textNodes: Text[] = []
        let node
        while ((node = walker.nextNode())) {
          textNodes.push(node as Text)
        }

        // Find and replace in text nodes
        textNodes.forEach((textNode) => {
          if (textNode.nodeValue && textNode.nodeValue.includes(mod.original)) {
            textNode.nodeValue = textNode.nodeValue.replace(mod.original, mod.modified)
          }
        })
      })

      newContent = tempDiv.innerHTML
    } else {
      // For plain text, simple replacement works
      modifications.forEach((mod) => {
        newContent = newContent.replace(mod.original, mod.modified)
      })
    }

    // Apply changes as preview
    docs.updateContent(docs.activeDocumentId, newContent)

    // Store pending modifications with IDs
    const modificationsWithIds = modifications.map((mod) => ({
      id: Date.now().toString() + Math.random().toString(36),
      original: mod.original,
      modified: mod.modified,
    }))
    setPendingModifications(modificationsWithIds)

    // Don't clear selections yet - keep highlights for accept/reject buttons
    // setSelections([])
    // setSelectedText('')
  }

  // Accept changes - keep the modifications
  const handleAcceptChanges = () => {
    setPendingModifications([])
    setSelections([])
    setSelectedText('')
    toast.success('Changes accepted!')
  }

  // Reject changes - revert to original
  const handleRejectChanges = () => {
    if (!docs.activeDocumentId || pendingModifications.length === 0) return

    let newContent = docs.documentContents[docs.activeDocumentId] || ''

    // Check if content is HTML or plain text
    const isHtmlContent = newContent.includes('<') && newContent.includes('>')

    if (isHtmlContent) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = newContent

      // Revert: replace modified back to original
      pendingModifications.forEach((mod) => {
        const walker = document.createTreeWalker(
          tempDiv,
          NodeFilter.SHOW_TEXT,
          null
        )

        const textNodes: Text[] = []
        let node
        while ((node = walker.nextNode())) {
          textNodes.push(node as Text)
        }

        textNodes.forEach((textNode) => {
          if (textNode.nodeValue && textNode.nodeValue.includes(mod.modified)) {
            textNode.nodeValue = textNode.nodeValue.replace(mod.modified, mod.original)
          }
        })
      })

      newContent = tempDiv.innerHTML
    } else {
      // For plain text, simple replacement works
      pendingModifications.forEach((mod) => {
        newContent = newContent.replace(mod.modified, mod.original)
      })
    }

    docs.updateContent(docs.activeDocumentId, newContent)
    setPendingModifications([])
    setSelections([])
    setSelectedText('')
    toast.success('Changes rejected!')
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
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-dark-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`px-6 py-4 flex items-center justify-between ${theme === 'dark' ? 'bg-dark-800 shadow-sm' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className={`text-xl font-bold bg-transparent border-none outline-none focus:outline-none px-0 py-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              style={{ width: `${Math.max(editedTitle.length * 12, 60)}px` }}
            />
          ) : (
            <h1
              onClick={handleTitleClick}
              className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${docs.activeDocumentId ? `cursor-pointer px-2 py-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}` : ''}`}
              title={docs.activeDocumentId ? 'Click to edit' : ''}
            >
              {currentTitle}
            </h1>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-dark-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Sidebar */}
        <Sidebar
          content={refs.referenceContent}
          onContentChange={refs.updateContent}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          documents={docs.documents}
          onSelectDocument={docs.openDocument}
          onCreateDocument={docs.createDocument}
          width={sidebarWidth}
          references={refs.references}
          selectedReferenceId={refs.selectedReferenceId}
          onSelectReference={refs.selectReference}
          onCreateReference={refs.createReference}
          onUpdateReferenceTitle={refs.updateTitle}
        />

        {/* Sidebar Resize Handle */}
        {!isSidebarCollapsed && (
          <div
            onMouseDown={handleSidebarMouseDown}
            className={`w-px hover:w-1 cursor-col-resize flex-shrink-0 transition-colors ${
              isDraggingSidebar ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-500'
            }`}
          />
        )}

        {/* Center: Tabbed Editor or Empty State */}
        {docs.openDocuments.length === 0 ? (
          <div className={`flex-1 flex items-center justify-center ${theme === 'dark' ? 'bg-dark-900' : 'bg-white'}`}>
            <div className={`text-center ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
              <svg className={`w-24 h-24 mx-auto mb-4 ${theme === 'dark' ? 'text-dark-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            pendingModifications={pendingModifications}
            onAcceptChanges={handleAcceptChanges}
            onRejectChanges={handleRejectChanges}
          />
        )}

        {/* AI Assistant Resize Handle */}
        <div
          onMouseDown={handleAIMouseDown}
          className={`w-px hover:w-1 cursor-col-resize flex-shrink-0 transition-colors ${
            isDraggingAI ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-500'
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
            referenceContent={refs.referenceContent}
            language="EN"
            referenceName={refs.selectedReferenceId ? refs.references.find(r => r.id === refs.selectedReferenceId)?.title : undefined}
            documentName={docs.activeDocumentId ? docs.openDocuments.find(d => d.id === docs.activeDocumentId)?.title : undefined}
            pendingModifications={pendingModifications}
            onAcceptChanges={handleAcceptChanges}
            onRejectChanges={handleRejectChanges}
          />
        </div>
      </div>
    </div>
  )
}

export default function CraftPage() {
  return (
    <ThemeProvider>
      <CraftPageContent />
    </ThemeProvider>
  )
}
