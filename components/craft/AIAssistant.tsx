'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export default function AIAssistant() {
  const {
    selectedText,
    selections,
    removeSelection,
    clearSelections,
    applyChanges,
    pendingModifications,
    acceptChanges,
    rejectChanges,
    references,
    selectedReferenceId,
    referenceContent,
    openDocuments,
    activeDocumentId,
  } = useAppStore()

  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get reference and document names
  const referenceName = selectedReferenceId
    ? references.find(r => r.id === selectedReferenceId)?.title
    : undefined

  const documentName = activeDocumentId
    ? openDocuments.find(d => d.id === activeDocumentId)?.title
    : undefined

  const [suggestions, setSuggestions] = useState<{ [key: string]: string }>({})

  const handleAskAI = async () => {
    if (selections.length === 0 || !instruction.trim()) return

    setLoading(true)
    try {
      // Process all selections with the same instruction
      const newSuggestions: { [key: string]: string } = {}

      await Promise.all(
        selections.map(async (selection) => {
          const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'text-modification',
              originalText: selection.text,
              instruction: instruction,
              referenceContext: referenceContent,
              language: 'EN',
            }),
          })

          if (!response.ok) throw new Error('Failed to get AI response')

          const data = await response.json()
          newSuggestions[selection.id] = data.result
        })
      )

      setSuggestions(newSuggestions)
      setInstruction('')
    } catch (error: any) {
      console.error('AI modification error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptSuggestion = (selectionId: string) => {
    const selection = selections.find(s => s.id === selectionId)
    const suggestion = suggestions[selectionId]

    if (!selection || !suggestion) return

    applyChanges([{
      original: selection.text,
      modified: suggestion,
    }])

    // Remove this suggestion and selection
    setSuggestions(prev => {
      const newSuggestions = { ...prev }
      delete newSuggestions[selectionId]
      return newSuggestions
    })
    removeSelection(selectionId)
  }

  const handleAcceptAll = () => {
    const modifications = selections
      .filter(s => suggestions[s.id])
      .map(s => ({
        original: s.text,
        modified: suggestions[s.id],
      }))

    if (modifications.length > 0) {
      applyChanges(modifications)
      setSuggestions({})
      clearSelections()
    }
  }

  const handleRejectAll = () => {
    setSuggestions({})
  }

  return (
    <div
      style={{ width: !isMobile ? useAppStore.getState().aiAssistantWidth : undefined }}
      className="flex-shrink-0 h-full flex flex-col bg-gray-100 w-full md:w-auto"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Selected Texts List - Discord style conversation */}
        {selections.length > 0 && (
          <div className="space-y-4">
            {selections.map((selection) => (
              <div key={selection.id} className="space-y-3">
                {/* User Selection */}
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-600 mb-1">Selected Text:</div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 text-sm text-gray-700 whitespace-pre-wrap">
                        {selection.text}
                      </div>
                      <button
                        onClick={() => removeSelection(selection.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Suggestion */}
                {suggestions[selection.id] && (
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-600 mb-1">AI Suggests:</div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 text-sm text-gray-700 whitespace-pre-wrap">
                          {suggestions[selection.id]}
                        </div>
                        <button
                          onClick={() => handleAcceptSuggestion(selection.id)}
                          className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 transition-colors"
                          title="Accept suggestion"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selections.length === 0 && (
          <div className="text-sm text-center py-8 text-gray-500">
            Select text in the document to get started
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 space-y-3 bg-gray-200">
        {/* AI Context - Files being used with Accept/Reject buttons */}
        {(documentName || referenceName || Object.keys(suggestions).length > 0) && (
          <div className="flex items-center justify-between gap-3">
            {/* File chips */}
            <div className="flex flex-wrap gap-2">
              {documentName && (
                <div className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs bg-white border border-gray-300 text-gray-700">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{documentName}</span>
                </div>
              )}
              {referenceName && (
                <div className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs bg-white border border-gray-300 text-gray-700">
                  <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{referenceName}</span>
                </div>
              )}
            </div>

            {/* Accept/Reject buttons - shown when there are suggestions */}
            {Object.keys(suggestions).length > 0 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleAcceptAll}
                  className="p-1.5 rounded transition-colors hover:bg-gray-300 text-emerald-600 hover:text-emerald-700"
                  title="Accept all suggestions"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleRejectAll}
                  className="p-1.5 rounded transition-colors hover:bg-gray-300 text-rose-600 hover:text-rose-700"
                  title="Reject all suggestions"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Type your instruction..."
            className="w-full rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 border border-gray-300"
            disabled={selections.length === 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleAskAI()
              }
            }}
          />
          <button
            onClick={handleAskAI}
            disabled={selections.length === 0 || !instruction.trim() || loading}
            className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-900"
            aria-label="Send"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m22 2-7 20-4-9-9-4 20-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
