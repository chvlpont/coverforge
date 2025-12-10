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
import { useAppStore } from '@/store/useAppStore'

export default function DocumentEditor() {
  const {
    activeDocumentId,
    documentContents,
    updateDocumentContent,
    addSelection,
    selections,
    clearSelections,
    pendingModifications,
  } = useAppStore()

  const [isInitialized, setIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const content = activeDocumentId ? documentContents[activeDocumentId] || '' : ''

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
              // Clear all existing highlights first
              const tr = view.state.tr
              view.state.doc.descendants((node, pos) => {
                if (node.marks.some(mark => mark.type.name === 'highlight')) {
                  node.marks.forEach(mark => {
                    if (mark.type.name === 'highlight') {
                      tr.removeMark(pos, pos + node.nodeSize, mark.type)
                    }
                  })
                }
              })

              // Apply yellow highlight to newly selected text
              tr.addMark(
                from,
                to,
                view.state.schema.marks.highlight.create()
              )

              view.dispatch(tr)
              addSelection(text)
            }
          }, 100)
        },
        keyup: (view, event) => {
          // Handle keyboard selections (Ctrl+A, Shift+Arrow keys, etc.)
          setTimeout(() => {
            const { from, to } = view.state.selection
            const text = view.state.doc.textBetween(from, to, ' ')

            if (text.trim() && from !== to) {
              // Clear all existing highlights first
              const tr = view.state.tr
              view.state.doc.descendants((node, pos) => {
                if (node.marks.some(mark => mark.type.name === 'highlight')) {
                  node.marks.forEach(mark => {
                    if (mark.type.name === 'highlight') {
                      tr.removeMark(pos, pos + node.nodeSize, mark.type)
                    }
                  })
                }
              })

              // Apply yellow highlight to newly selected text
              tr.addMark(
                from,
                to,
                view.state.schema.marks.highlight.create()
              )

              view.dispatch(tr)
              addSelection(text)
            }
          }, 100)
        },
      },
    },
    onUpdate: ({ editor, transaction }) => {
      const html = editor.getHTML()
      if (activeDocumentId) {
        updateDocumentContent(activeDocumentId, html)
      }

      // Detect user-initiated changes (not programmatic)
      if (transaction.steps.length > 0 && transaction.docChanged) {
        // User is editing - clear selections and pending modifications
        clearSelections()
      }
    },
  })

  // Initialize content when editor is ready
  useEffect(() => {
    if (editor && !isInitialized) {
      editor.commands.setContent(content || '')
      setIsInitialized(true)
    }
  }, [editor, isInitialized, content])

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
      const { state } = editor
      const tr = state.tr

      // Remove all highlight marks from the entire document
      state.doc.descendants((node, pos) => {
        if (node.marks.some(mark => mark.type.name === 'highlight')) {
          node.marks.forEach(mark => {
            if (mark.type.name === 'highlight') {
              tr.removeMark(pos, pos + node.nodeSize, mark.type)
            }
          })
        }
      })

      if (tr.docChanged) {
        editor.view.dispatch(tr)
      }
    }
  }, [selections, editor, isInitialized])

  // Clear highlights when pending modifications are cleared (after accept/reject)
  useEffect(() => {
    if (editor && isInitialized && pendingModifications.length === 0) {
      const { state } = editor
      const tr = state.tr

      // Remove all highlight marks from the entire document
      state.doc.descendants((node, pos) => {
        if (node.marks.some(mark => mark.type.name === 'highlight')) {
          node.marks.forEach(mark => {
            if (mark.type.name === 'highlight') {
              tr.removeMark(pos, pos + node.nodeSize, mark.type)
            }
          })
        }
      })

      if (tr.docChanged) {
        editor.view.dispatch(tr)
      }
    }
  }, [pendingModifications, editor, isInitialized])

  return (
    <div ref={containerRef} className="h-full flex flex-col relative bg-white">
      {/* Format Toolbar */}
      <FormatToolbar editor={editor} />

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto py-12 px-16 relative">
          <EditorContent
            editor={editor}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
