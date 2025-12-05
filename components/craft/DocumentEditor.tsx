'use client'

import { useRef, useEffect, useState } from 'react'

interface TextSelection {
  id: string
  text: string
}

interface DocumentEditorProps {
  content: string
  onContentChange: (content: string) => void
  onTextSelect: (selectedText: string) => void
  selections: TextSelection[]
  onRemoveSelection: (id: string) => void
}

export default function DocumentEditor({
  content,
  onContentChange,
  onTextSelect,
  selections,
  onRemoveSelection,
}: DocumentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Update editor content when content or selections change (but not during editing)
  useEffect(() => {
    if (editorRef.current && !isEditing) {
      const html = renderContentWithHighlights()
      editorRef.current.innerHTML = html
    }
  }, [content, selections])

  const handleSelectionChange = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''

    if (selectedText.trim()) {
      onTextSelect(selectedText)
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setIsEditing(true)
    const newContent = e.currentTarget.textContent || ''
    onContentChange(newContent)
    setTimeout(() => setIsEditing(false), 100)
  }

  const renderContentWithHighlights = () => {
    if (selections.length === 0) {
      return content
    }

    let result = content
    const sortedSelections = [...selections].sort((a, b) => {
      const indexA = content.indexOf(a.text)
      const indexB = content.indexOf(b.text)
      return indexB - indexA // Sort in reverse order to replace from end to start
    })

    sortedSelections.forEach((selection) => {
      const index = result.indexOf(selection.text)
      if (index !== -1) {
        const before = result.substring(0, index)
        const after = result.substring(index + selection.text.length)

        const highlightedHtml = `<span class="bg-yellow-200" data-selection-id="${selection.id}">${selection.text}</span>`

        result = before + highlightedHtml + after
      }
    })

    return result
  }


  return (
    <div className="h-full bg-white flex flex-col">
      {/* Document Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full max-w-4xl mx-auto py-12 px-16">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            className="w-full h-full bg-transparent text-gray-900 text-base leading-relaxed focus:outline-none font-serif whitespace-pre-wrap"
            style={{
              lineHeight: '1.8',
              fontSize: '16px',
              minHeight: '100%',
            }}
          />
        </div>
      </div>
    </div>
  )
}
