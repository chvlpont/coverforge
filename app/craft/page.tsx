'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/Loader'
import TabbedEditor from '@/components/craft/TabbedEditor'
import AIAssistant from '@/components/craft/AIAssistant'
import Sidebar from '@/components/craft/Sidebar'
import { useAppStore } from '@/store/useAppStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function CraftPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false)
  const [isDraggingAI, setIsDraggingAI] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)

  // Get everything from the store
  const {
    user,
    setUser,
    documents,
    openDocuments,
    activeDocumentId,
    fetchDocuments,
    setActiveDocumentId,
    fetchReferences,
    isSidebarCollapsed,
    toggleSidebar,
    sidebarWidth,
    setSidebarWidth,
    aiAssistantWidth,
    setAIAssistantWidth,
  } = useAppStore()

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
  }, [router, supabase, setUser])

  // Fetch data when user is set
  useEffect(() => {
    if (user) {
      fetchDocuments()
      fetchReferences()
    }
  }, [user, fetchDocuments, fetchReferences])

  // Auto-open document from URL
  useEffect(() => {
    const docId = searchParams.get('doc')
    if (docId && documents.length > 0) {
      const doc = documents.find(d => d.id === docId)
      if (doc && !openDocuments.find(d => d.id === docId)) {
        useAppStore.getState().openDocument(docId)
      }
    }
  }, [searchParams, documents, openDocuments])

  // Handle title edit
  const handleTitleClick = () => {
    if (activeDocumentId) {
      const activeDoc = openDocuments.find(d => d.id === activeDocumentId)
      if (activeDoc) {
        setEditedTitle(activeDoc.title)
        setIsEditingTitle(true)
      }
    }
  }

  const handleTitleBlur = () => {
    if (activeDocumentId && editedTitle.trim()) {
      useAppStore.getState().updateDocumentTitle(activeDocumentId, editedTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (activeDocumentId && editedTitle.trim()) {
        useAppStore.getState().updateDocumentTitle(activeDocumentId, editedTitle.trim())
      }
      setIsEditingTitle(false)
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  // Get current title
  const currentTitle = activeDocumentId
    ? openDocuments.find(d => d.id === activeDocumentId)?.title || 'Craft'
    : 'Craft'

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!activeDocumentId) return

    const editorElement = document.querySelector('.tiptap')
    if (!editorElement) return

    try {
      // Create a temporary container with white background
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.background = 'white'
      container.style.padding = '40px'
      container.style.width = '800px'

      // Clone the editor content
      const clone = editorElement.cloneNode(true) as HTMLElement
      container.appendChild(clone)
      document.body.appendChild(container)

      // Capture as canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      })

      // Remove temporary container
      document.body.removeChild(container)

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${currentTitle}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

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
  }, [isDraggingSidebar, isDraggingAI, dragStartX, dragStartWidth, setSidebarWidth, setAIAssistantWidth])

  if (loading) return <Loader />

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="text-xl font-bold bg-transparent border-none outline-none focus:outline-none px-0 py-0 text-gray-900"
              style={{ width: `${Math.max(editedTitle.length * 12, 60)}px` }}
            />
          ) : (
            <h1
              onClick={handleTitleClick}
              className={`text-xl font-bold text-gray-900 ${activeDocumentId ? 'cursor-pointer px-2 py-1 rounded transition-colors hover:bg-gray-100' : ''}`}
              title={activeDocumentId ? 'Click to edit' : ''}
            >
              {currentTitle}
            </h1>
          )}
          {activeDocumentId && (
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
              title="Download as PDF"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Sidebar */}
        <Sidebar />

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
        {openDocuments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl mb-2">No documents open</p>
              <p className="text-sm">Create or open a document from the sidebar to get started</p>
            </div>
          </div>
        ) : (
          <TabbedEditor />
        )}

        {/* AI Assistant Resize Handle */}
        <div
          onMouseDown={handleAIMouseDown}
          className={`w-px hover:w-1 cursor-col-resize flex-shrink-0 transition-colors ${
            isDraggingAI ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-500'
          }`}
        />

        {/* Right: AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  )
}

export default function CraftPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CraftPageContent />
    </Suspense>
  )
}
