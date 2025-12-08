'use client'

import { useAppStore } from '@/store/useAppStore'

export default function ReferencesList() {
  const { theme, references, createReference, selectReference } = useAppStore()

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Create New Button */}
      <button
        onClick={createReference}
        className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors mb-4 flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Reference
      </button>

      {/* References List */}
      {references.length === 0 ? (
        <div className={`text-center text-sm py-8 ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
          <p>No references yet</p>
          <p className="text-xs mt-1">Click "New Reference" to create one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {references.map((ref) => (
            <button
              key={ref.id}
              onClick={() => selectReference(ref.id)}
              className={`w-full text-left rounded-lg px-4 py-3 text-sm transition-colors border hover:border-primary-500 cursor-pointer ${theme === 'dark' ? 'bg-dark-800 hover:bg-dark-750 border-dark-700' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
            >
              <div className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{ref.title}</div>
              <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
                {new Date(ref.updated_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
