'use client'

import { useEffect, useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle, FontFamily } from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { FontSize } from '@/lib/tiptap-extensions'
import FormatToolbar from './FormatToolbar'
import { Check, X } from 'lucide-react'

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
  pendingModifications: { id: string; original: string; modified: string }[]
  onAcceptChanges: () => void
  onRejectChanges: () => void
}

export default function DocumentEditor({
  content,
  onContentChange,
  onTextSelect,
  selections,
  onRemoveSelection,
  pendingModifications,
  onAcceptChanges,
  onRejectChanges,
}: DocumentEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-lg max-w-none focus:outline-none min-h-full text-gray-900',
        style: 'font-size: 11px; font-family: Arial, sans-serif;',
      },
      handleDOMEvents: {
        mouseup: (view, event) => {
          setTimeout(() => {
            const { from, to } = view.state.selection
            const text = view.state.doc.textBetween(from, to, ' ')

            if (text.trim() && from !== to) {
              // Apply yellow highlight to selected text
              view.dispatch(
                view.state.tr.addMark(
                  from,
                  to,
                  view.state.schema.marks.highlight.create()
                )
              )
              onTextSelect(text)
            }
          }, 10)
          return false
        },
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onContentChange(html)
    },
  })

  // Initialize content when editor is ready
  useEffect(() => {
    if (editor && !isInitialized) {
      editor.commands.setContent(content || '')
      setIsInitialized(true)
    }
  }, [editor, isInitialized])

  // Update editor content when content changes externally (e.g., from AI)
  useEffect(() => {
    if (editor && isInitialized && content !== editor.getHTML()) {
      const { from, to } = editor.state.selection
      editor.commands.setContent(content, { emitUpdate: false })
      // Restore cursor position
      editor.commands.setTextSelection({ from, to })
    }
  }, [content, editor, isInitialized])

  // Clear highlights when selections are removed
  useEffect(() => {
    if (editor && isInitialized && selections.length === 0) {
      editor.commands.unsetHighlight()
    }
  }, [selections, editor, isInitialized])

  // Clear highlights when pending modifications are cleared (after accept/reject)
  useEffect(() => {
    if (editor && isInitialized && pendingModifications.length === 0) {
      editor.commands.unsetHighlight()
    }
  }, [pendingModifications, editor, isInitialized])

  // Calculate button position based on highlighted text
  useEffect(() => {
    if (pendingModifications.length > 0 && containerRef.current) {
      const updatePosition = () => {
        // Find the first highlighted element
        const highlightedElement = containerRef.current?.querySelector('mark')

        if (highlightedElement) {
          const rect = highlightedElement.getBoundingClientRect()
          const containerRect = containerRef.current?.getBoundingClientRect()

          if (containerRect) {
            setButtonPosition({
              top: rect.top - containerRect.top + (rect.height / 2),
              left: rect.right - containerRect.left + 16, // 16px spacing from text
            })
          }
        }
      }

      updatePosition()

      // Update position on scroll or resize
      const scrollContainer = containerRef.current.querySelector('.overflow-y-auto')
      scrollContainer?.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)

      return () => {
        scrollContainer?.removeEventListener('scroll', updatePosition)
        window.removeEventListener('resize', updatePosition)
      }
    } else {
      setButtonPosition(null)
    }
  }, [pendingModifications])

  return (
    <div ref={containerRef} className="h-full bg-white flex flex-col relative">
      {/* Format Toolbar */}
      <FormatToolbar editor={editor} />

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full max-w-4xl mx-auto py-12 px-16 relative">
          <EditorContent
            editor={editor}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Accept/Reject Controls - Positioned next to modified text */}
      {pendingModifications.length > 0 && buttonPosition && (
        <div
          className="absolute flex gap-2 z-50 animate-in fade-in slide-in-from-left-2 duration-200"
          style={{
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            transform: 'translateY(-50%)',
          }}
        >
          {/* Accept Button */}
          <button
            onClick={onAcceptChanges}
            className="group relative bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ring-2 ring-white/20 hover:ring-white/30"
            title="Accept changes"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-200" />
          </button>

          {/* Reject Button */}
          <button
            onClick={onRejectChanges}
            className="group relative bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ring-2 ring-white/20 hover:ring-white/30"
            title="Reject changes"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-red-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-200" />
          </button>
        </div>
      )}
    </div>
  )
}
