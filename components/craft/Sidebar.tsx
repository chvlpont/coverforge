'use client'

import { useRef, useEffect, useState } from 'react'
import { Document } from '@/lib/types/database'
import DocumentsList from './DocumentsList'

interface SidebarProps {
  content: string
  onContentChange: (content: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  documents: Document[]
  onSelectDocument: (documentId: string) => void
  onCreateDocument: () => void
}

export default function Sidebar({
  content,
  onContentChange,
  isCollapsed,
  onToggleCollapse,
  documents,
  onSelectDocument,
  onCreateDocument,
}: SidebarProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'reference' | 'documents'>('reference')
  const placeholder = "Add reference information here (job description, company info, etc.)..."

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
    <div className={`h-full bg-dark-850 flex flex-col border-r border-dark-700 transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-700 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Sidebar</h3>
            </div>
          )}
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
          <div className="flex border-t border-dark-700">
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
            <div className="flex-1 overflow-y-auto p-4">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full h-full bg-dark-800 rounded-lg p-4 text-dark-100 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 whitespace-pre-wrap"
                style={{
                  minHeight: '100px',
                }}
              />
            </div>
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
