'use client'

import { useEffect } from 'react'
import DocumentEditor from './DocumentEditor'
import { useAppStore } from '@/store/useAppStore'

export default function TabbedEditor() {
  const {
    openDocuments,
    activeDocumentId,
    setActiveDocumentId,
    closeDocument,
  } = useAppStore()

  // Auto-select first document if none selected
  useEffect(() => {
    if (!activeDocumentId && openDocuments.length > 0) {
      setActiveDocumentId(openDocuments[0].id)
    }
  }, [activeDocumentId, openDocuments, setActiveDocumentId])

  const activeDocument = activeDocumentId
    ? openDocuments.find(d => d.id === activeDocumentId)
    : openDocuments[0]

  const handleCloseTab = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    closeDocument(docId)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="flex items-center overflow-x-auto bg-gray-200">
        {openDocuments.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setActiveDocumentId(doc.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${
              activeDocumentId === doc.id
                ? 'text-gray-900 border-blue-500 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            <span>{doc.title}</span>
            <span
              onClick={(e) => handleCloseTab(doc.id, e)}
              className="rounded p-0.5 transition-colors cursor-pointer hover:bg-gray-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {activeDocument && <DocumentEditor />}
      </div>
    </div>
  )
}
