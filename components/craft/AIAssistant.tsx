'use client'

import { useState } from 'react'

interface TextSelection {
  id: string
  text: string
}

interface AIAssistantProps {
  selectedText: string
  selections: TextSelection[]
  onAddSelection: () => void
  onRemoveSelection: (id: string) => void
  onApplyChanges: (modifications: { original: string; modified: string }[]) => void
  referenceContent: string
  language: string
  referenceName?: string
  documentName?: string
}

export default function AIAssistant({
  selectedText,
  selections,
  onAddSelection,
  onRemoveSelection,
  onApplyChanges,
  referenceContent,
  language,
  referenceName,
  documentName,
}: AIAssistantProps) {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAskAI = async () => {
    if (selections.length === 0 || !instruction.trim()) return

    setLoading(true)
    try {
      // Process all selections with the same instruction
      const modifications = await Promise.all(
        selections.map(async (selection) => {
          const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'text-modification',
              originalText: selection.text,
              instruction: instruction,
              referenceContext: referenceContent,
              language: language,
            }),
          })

          if (!response.ok) throw new Error('Failed to get AI response')

          const data = await response.json()
          return {
            original: selection.text,
            modified: data.result,
          }
        })
      )

      // Directly apply changes instead of showing suggestions
      onApplyChanges(modifications)
      setInstruction('')
    } catch (error: any) {
      console.error('AI modification error:', error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="h-full bg-dark-800 flex flex-col">
      {/* Header */}
      <div className="bg-dark-900 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Selected Texts List */}
        {selections.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-dark-400 font-medium">
              Selected Sections ({selections.length}):
            </div>
            {selections.map((selection) => (
              <div
                key={selection.id}
                className="bg-dark-700 rounded-lg p-3 flex items-start gap-2"
              >
                <div className="flex-1 text-sm text-white whitespace-pre-wrap line-clamp-2">
                  {selection.text}
                </div>
                <button
                  onClick={() => onRemoveSelection(selection.id)}
                  className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {selections.length === 0 && (
          <div className="text-dark-400 text-sm text-center py-8">
            Select text in the document to get started
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 space-y-3 bg-dark-850">
        {/* AI Context - Files being used */}
        {(documentName || referenceName) && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {documentName && (
                <div className="inline-flex items-center gap-1.5 bg-dark-700 border border-dark-600 rounded-md px-2.5 py-1.5 text-xs text-dark-300">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{documentName}</span>
                </div>
              )}
              {referenceName && (
                <div className="inline-flex items-center gap-1.5 bg-dark-700 border border-dark-600 rounded-md px-2.5 py-1.5 text-xs text-dark-300">
                  <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{referenceName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Type your instruction..."
            className="w-full bg-dark-700 text-white border border-dark-600 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
