'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle, FontFamily } from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { FontSize } from '@/lib/tiptap-extensions'
import FormatToolbar from './FormatToolbar'

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
  const [isInitialized, setIsInitialized] = useState(false)

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

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Format Toolbar */}
      <FormatToolbar editor={editor} />

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full max-w-4xl mx-auto py-12 px-16">
          <EditorContent
            editor={editor}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
