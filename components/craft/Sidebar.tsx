'use client'

import { useRef, useEffect, useState } from 'react'
import { Document, Reference } from '@/lib/types/database'
import DocumentsList from './DocumentsList'
import ReferencesList from './ReferencesList'

interface SidebarProps {
  content: string
  onContentChange: (content: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  documents: Document[]
  onSelectDocument: (documentId: string) => void
  onCreateDocument: () => void
  width: number
  references: Reference[]
  selectedReferenceId: string | null
  onSelectReference: (referenceId: string) => void
  onCreateReference: () => void
  onUpdateReferenceTitle: (referenceId: string, title: string) => void
}

export default function Sidebar({
  content,
  onContentChange,
  isCollapsed,
  onToggleCollapse,
  documents,
  onSelectDocument,
  onCreateDocument,
  width,
  references,
  selectedReferenceId,
  onSelectReference,
  onCreateReference,
  onUpdateReferenceTitle,
}: SidebarProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'reference' | 'documents'>('reference')
  const [showReferenceEditor, setShowReferenceEditor] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const placeholder = "Add reference information here (job description, company info, etc.)..."

  // Show editor when a reference is selected
  useEffect(() => {
    if (selectedReferenceId) {
      setShowReferenceEditor(true)
    } else {
      setShowReferenceEditor(false)
    }
  }, [selectedReferenceId])

  // Handle reference selection
  const handleSelectReference = (referenceId: string) => {
    onSelectReference(referenceId)
    setShowReferenceEditor(true)
  }

  // Get current reference
  const currentReference = selectedReferenceId
    ? references.find(r => r.id === selectedReferenceId)
    : null

  // Handle title edit
  const handleTitleClick = () => {
    if (currentReference) {
      setEditedTitle(currentReference.title)
      setIsEditingTitle(true)
    }
  }

  const handleTitleBlur = () => {
    if (selectedReferenceId && editedTitle.trim()) {
      onUpdateReferenceTitle(selectedReferenceId, editedTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedReferenceId && editedTitle.trim()) {
        onUpdateReferenceTitle(selectedReferenceId, editedTitle.trim())
      }
      setIsEditingTitle(false)
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  // Update editor content when content changes (but not during editing)
  useEffect(() => {
    if (editorRef.current && !isEditing) {
      const displayContent = content || placeholder
      editorRef.current.textContent = displayContent
      editorRef.current.classList.toggle('text-dark-400', !content)
    }
  }, [content])

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setIsEditing(true)
    const newContent = e.currentTarget.textContent || ''
    const actualContent = newContent === placeholder ? '' : newContent
    onContentChange(actualContent)
    setTimeout(() => setIsEditing(false), 100)
  }

  const handleFocus = () => {
    if (editorRef.current && editorRef.current.textContent === placeholder) {
      editorRef.current.textContent = ''
      editorRef.current.classList.remove('text-dark-400')
    }
  }

  const handleBlur = () => {
    if (editorRef.current && !editorRef.current.textContent?.trim()) {
      editorRef.current.textContent = placeholder
      editorRef.current.classList.add('text-dark-400')
    }
  }

  return (
    <div
      className="h-full bg-dark-850 flex flex-col flex-shrink-0"
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
    >
      {/* Header */}
      <div className="bg-dark-900 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-end">
          <button
            onClick={onToggleCollapse}
            className="text-dark-400 hover:text-white transition-colors p-1"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Tabs */}
        {!isCollapsed && (
          <div className="flex mt-2">
            <button
              onClick={() => setActiveTab('reference')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'reference'
                  ? 'text-white bg-dark-850 border-b-2 border-primary-500'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Reference
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'text-white bg-dark-850 border-b-2 border-primary-500'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Documents
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          {activeTab === 'reference' ? (
            <>
              {showReferenceEditor ? (
                <div className="flex-1 flex flex-col">
                  {/* Back Button & Title */}
                  <div className="px-4 pt-4 pb-2 space-y-3">
                    <button
                      onClick={() => {
                        setShowReferenceEditor(false)
                        onSelectReference('')
                      }}
                      className="flex items-center gap-2 text-dark-400 hover:text-white text-sm transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to references
                    </button>

                    {/* Editable Title */}
                    {isEditingTitle ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        autoFocus
                        className="text-lg font-semibold text-white bg-transparent border-none outline-none focus:outline-none px-0 py-0 w-full"
                      />
                    ) : (
                      <h3
                        onClick={handleTitleClick}
                        className="text-lg font-semibold text-white cursor-pointer hover:bg-dark-700 px-2 py-1 rounded transition-colors -ml-2"
                        title="Click to edit"
                      >
                        {currentReference?.title || 'Reference'}
                      </h3>
                    )}
                  </div>
                  {/* Editor */}
                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleInput}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className="w-full h-full bg-dark-800 rounded-lg p-4 text-dark-100 text-sm leading-relaxed focus:outline-none whitespace-pre-wrap"
                      style={{
                        minHeight: '200px',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <ReferencesList
                  references={references}
                  onSelectReference={handleSelectReference}
                  onCreateReference={onCreateReference}
                />
              )}
            </>
          ) : (
            <DocumentsList
              documents={documents}
              onSelectDocument={onSelectDocument}
              onCreateDocument={onCreateDocument}
            />
          )}
        </>
      )}
    </div>
  )
}
