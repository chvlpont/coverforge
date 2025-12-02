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
}

export default function AIAssistant({
  selectedText,
  selections,
  onAddSelection,
  onRemoveSelection,
  onApplyChanges,
  referenceContent,
  language,
}: AIAssistantProps) {
  const [instruction, setInstruction] = useState('')
  const [aiResponses, setAIResponses] = useState<{ original: string; modified: string }[]>([])
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

      setAIResponses(modifications)
    } catch (error: any) {
      setAIResponses([{ original: '', modified: 'Error: ' + error.message }])
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (aiResponses.length > 0) {
      onApplyChanges(aiResponses)
      setAIResponses([])
      setInstruction('')
    }
  }

  return (
    <div className="h-full bg-dark-800 flex flex-col">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Current Selection */}
        {selectedText && (
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-dark-400">Current Selection:</div>
              <button
                onClick={onAddSelection}
                className="text-xs bg-primary-600 hover:bg-primary-700 text-white rounded px-3 py-1 transition-colors cursor-pointer"
              >
                + Add to List
              </button>
            </div>
            <div className="text-sm text-white whitespace-pre-wrap line-clamp-3">
              {selectedText}
            </div>
          </div>
        )}

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

        {!selectedText && selections.length === 0 && (
          <div className="text-dark-400 text-sm text-center py-8">
            Select text in the document to get started
          </div>
        )}

        {/* AI Responses */}
        {aiResponses.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-primary-400 font-medium">
              AI Suggestions ({aiResponses.length}):
            </div>
            {aiResponses.map((response, index) => (
              <div
                key={index}
                className="bg-primary-900/20 border border-primary-700 rounded-lg p-3"
              >
                <div className="text-sm text-white whitespace-pre-wrap">
                  {response.modified}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-dark-700 p-4 space-y-3">
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Type your instruction (e.g., 'make this more professional')"
          className="w-full bg-dark-700 text-white border border-dark-600 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          disabled={selections.length === 0}
        />

        <div className="flex gap-2">
          <button
            onClick={handleAskAI}
            disabled={selections.length === 0 || !instruction.trim() || loading}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Processing...' : 'Ask AI'}
          </button>

          {aiResponses.length > 0 && (
            <button
              onClick={handleApply}
              className="flex-1 bg-accent-600 hover:bg-accent-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors cursor-pointer"
            >
              Apply All
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
