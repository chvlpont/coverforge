'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Type
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface FormatToolbarProps {
  editor: Editor | null
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
  theme = 'dark'
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
  theme?: 'light' | 'dark'
}) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition-colors ${
      theme === 'dark'
        ? `hover:bg-gray-700 ${isActive ? 'bg-indigo-900 text-indigo-400' : 'text-gray-300'}`
        : `hover:bg-gray-200 ${isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700'}`
    }`}
  >
    {children}
  </button>
)

const Divider = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => (
  <div className={`w-px h-6 mx-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`} />
)

export default function FormatToolbar({ editor }: FormatToolbarProps) {
  const { theme } = useTheme()

  if (!editor) {
    return null
  }

  const fontFamilies = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { label: 'Impact', value: 'Impact, sans-serif' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  ]

  const fontSizes = [
    '8',
    '9',
    '10',
    '11',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
    '26',
    '28',
    '36',
    '48',
    '72',
  ]

  const setFontFamily = (font: string) => {
    if (font) {
      editor.chain().focus().setFontFamily(font).run()
    }
  }

  const setFontSize = (size: string) => {
    if (size) {
      editor.chain().focus().setFontSize(`${size}px`).run()
    }
  }

  return (
    <div className={`border-b p-2 flex items-center justify-center gap-1 flex-wrap sticky top-0 z-10 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      {/* Font Family Dropdown */}
      <div className="relative">
        <select
          onChange={(e) => setFontFamily(e.target.value)}
          defaultValue="Arial, sans-serif"
          className={`px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
          title="Font family"
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size Dropdown */}
      <div className="relative">
        <select
          onChange={(e) => setFontSize(e.target.value)}
          defaultValue="11"
          className={`px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
          title="Font size"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <Divider theme={theme} />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
        theme={theme}
      >
        <Heading1 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
        theme={theme}
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
        theme={theme}
      >
        <Heading3 size={18} />
      </ToolbarButton>

      <Divider theme={theme} />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
        theme={theme}
      >
        <Bold size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
        theme={theme}
      >
        <Italic size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
        theme={theme}
      >
        <Underline size={18} />
      </ToolbarButton>

      <Divider theme={theme} />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
        theme={theme}
      >
        <List size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numbered List"
        theme={theme}
      >
        <ListOrdered size={18} />
      </ToolbarButton>

      <Divider theme={theme} />

      {/* Text Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
        theme={theme}
      >
        <AlignLeft size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
        theme={theme}
      >
        <AlignCenter size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
        theme={theme}
      >
        <AlignRight size={18} />
      </ToolbarButton>
    </div>
  )
}
