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
  theme: 'light' | 'dark'
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
  theme,
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
      const placeholderClass = theme === 'dark' ? 'text-dark-400' : 'text-gray-400'
      editorRef.current.classList.toggle(placeholderClass, !content)
    }
  }, [content, theme])

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
      const placeholderClass = theme === 'dark' ? 'text-dark-400' : 'text-gray-400'
      editorRef.current.classList.remove(placeholderClass)
    }
  }

  const handleBlur = () => {
    if (editorRef.current && !editorRef.current.textContent?.trim()) {
      editorRef.current.textContent = placeholder
      const placeholderClass = theme === 'dark' ? 'text-dark-400' : 'text-gray-400'
      editorRef.current.classList.add(placeholderClass)
    }
  }

  return (
    <div
      className={`h-full flex flex-col flex-shrink-0 ${theme === 'dark' ? 'bg-dark-850' : 'bg-gray-100'}`}
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
    >
      {/* Header */}
      <div className={`flex-shrink-0 ${theme === 'dark' ? 'bg-dark-900' : 'bg-gray-200'}`}>
        <div className="px-4 py-3 flex items-center justify-end">
          <button
            onClick={onToggleCollapse}
            className={`transition-colors p-1 ${theme === 'dark' ? 'text-dark-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
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
                  ? theme === 'dark'
                    ? 'text-white bg-dark-850 border-b-2 border-blue-500'
                    : 'text-gray-900 bg-gray-50 border-b-2 border-blue-500'
                  : theme === 'dark'
                    ? 'text-dark-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reference
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? theme === 'dark'
                    ? 'text-white bg-dark-850 border-b-2 border-blue-500'
                    : 'text-gray-900 bg-gray-50 border-b-2 border-blue-500'
                  : theme === 'dark'
                    ? 'text-dark-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
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
                      className={`flex items-center gap-2 text-sm transition-colors ${theme === 'dark' ? 'text-dark-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
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
                        className={`text-lg font-semibold bg-transparent border-none outline-none focus:outline-none px-0 py-0 w-full ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      />
                    ) : (
                      <h3
                        onClick={handleTitleClick}
                        className={`text-lg font-semibold cursor-pointer px-2 py-1 rounded transition-colors -ml-2 ${theme === 'dark' ? 'text-white hover:bg-dark-700' : 'text-gray-900 hover:bg-gray-200'}`}
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
                      className={`w-full h-full rounded-lg p-4 text-sm leading-relaxed focus:outline-none whitespace-pre-wrap ${theme === 'dark' ? 'bg-dark-800 text-dark-100' : 'bg-white text-gray-900 border border-gray-200'}`}
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
                  theme={theme}
                />
              )}
            </>
          ) : (
            <DocumentsList
              documents={documents}
              onSelectDocument={onSelectDocument}
              onCreateDocument={onCreateDocument}
              theme={theme}
            />
          )}
        </>
      )}
    </div>
  )
}
