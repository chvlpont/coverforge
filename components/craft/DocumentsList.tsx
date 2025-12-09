'use client'

import { useAppStore } from '@/store/useAppStore'

export default function DocumentsList() {
  const { documents, createDocument, openDocument, deleteDocument } = useAppStore()

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this document?')) return
    await deleteDocument(docId)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Create New Button */}
      <button
        onClick={createDocument}
        className="w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors mb-4 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Document
      </button>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center text-sm py-8 text-gray-500">
          <p>No documents yet</p>
          <p className="text-xs mt-1">Click "New Document" to create one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => openDocument(doc.id)}
              className="w-full text-left rounded-lg px-4 py-3 text-sm transition-colors border hover:border-primary-500 cursor-pointer bg-white hover:bg-gray-50 border-gray-200 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-gray-900">{doc.title}</div>
                  <div className="text-xs mt-1 text-gray-500">
                    {new Date(doc.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, doc.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                  title="Delete document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
