'use client'

import { Document } from '@/lib/types/database'

interface DocumentsListProps {
  documents: Document[]
  onSelectDocument: (documentId: string) => void
  onCreateDocument: () => void
}

export default function DocumentsList({
  documents,
  onSelectDocument,
  onCreateDocument,
}: DocumentsListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Create New Button */}
      <button
        onClick={onCreateDocument}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors mb-4 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Document
      </button>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center text-dark-400 text-sm py-8">
          <p>No documents yet</p>
          <p className="text-xs mt-1">Click "New Document" to create one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className="w-full bg-dark-800 hover:bg-dark-750 text-left rounded-lg px-4 py-3 text-sm transition-colors border border-dark-700 hover:border-primary-500 cursor-pointer"
            >
              <div className="font-medium text-white truncate">{doc.title}</div>
              <div className="text-xs text-dark-400 mt-1">
                {new Date(doc.updated_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
