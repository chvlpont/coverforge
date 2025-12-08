'use client'

import { useEffect } from 'react'
import { Document } from '@/lib/types/database'
import DocumentEditor from './DocumentEditor'

interface TabbedEditorProps {
  openDocuments: Document[]
  activeDocumentId: string | null
  documentContents: { [key: string]: string }
  onDocumentContentChange: (documentId: string, content: string) => void
  onActiveDocumentChange: (documentId: string) => void
  onCloseDocument: (documentId: string) => void
  onTextSelect: (text: string) => void
  selections: { id: string; text: string }[]
  onRemoveSelection: (id: string) => void
  pendingModifications: { id: string; original: string; modified: string }[]
  onAcceptChanges: () => void
  onRejectChanges: () => void
}

export default function TabbedEditor({
  openDocuments,
  activeDocumentId,
  documentContents,
  onDocumentContentChange,
  onActiveDocumentChange,
  onCloseDocument,
  onTextSelect,
  selections,
  onRemoveSelection,
  pendingModifications,
  onAcceptChanges,
  onRejectChanges,
}: TabbedEditorProps) {
  // Auto-select first document if none selected
  useEffect(() => {
    if (!activeDocumentId && openDocuments.length > 0) {
      onActiveDocumentChange(openDocuments[0].id)
    }
  }, [activeDocumentId, openDocuments, onActiveDocumentChange])

  const activeDocument = activeDocumentId
    ? openDocuments.find(d => d.id === activeDocumentId)
    : openDocuments[0]

  const handleCloseTab = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onCloseDocument(docId)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="bg-dark-900 border-b border-dark-700 flex items-center overflow-x-auto">
        {openDocuments.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onActiveDocumentChange(doc.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${
              activeDocumentId === doc.id
                ? 'text-white border-primary-500 bg-dark-850'
                : 'text-dark-400 hover:text-white border-transparent'
            }`}
          >
            <span>{doc.title}</span>
            <span
              onClick={(e) => handleCloseTab(doc.id, e)}
              className="hover:bg-dark-700 rounded p-0.5 transition-colors cursor-pointer"
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
        {activeDocument && (
          <DocumentEditor
            content={documentContents[activeDocument.id] || ''}
            onContentChange={(content) => onDocumentContentChange(activeDocument.id, content)}
            onTextSelect={onTextSelect}
            selections={selections}
            onRemoveSelection={onRemoveSelection}
            pendingModifications={pendingModifications}
            onAcceptChanges={onAcceptChanges}
            onRejectChanges={onRejectChanges}
          />
        )}
      </div>
    </div>
  )
}
