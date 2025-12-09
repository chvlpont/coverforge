import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Document, Reference } from '@/lib/types/database'
import toast from 'react-hot-toast'

interface TextSelection {
  id: string
  text: string
}

interface PendingModification {
  id: string
  original: string
  modified: string
}

interface AppState {
  // User
  user: any
  setUser: (user: any) => void

  // Selections & AI
  selectedText: string
  selections: TextSelection[]
  pendingModifications: PendingModification[]
  setSelectedText: (text: string) => void
  addSelection: (text: string) => void
  removeSelection: (id: string) => void
  clearSelections: () => void
  applyChanges: (modifications: { original: string; modified: string }[]) => void
  acceptChanges: () => void
  rejectChanges: () => void

  // Documents
  documents: Document[]
  openDocuments: Document[]
  activeDocumentId: string | null
  documentContents: { [key: string]: string }
  fetchDocuments: () => Promise<void>
  createDocument: () => Promise<void>
  openDocument: (documentId: string) => void
  closeDocument: (documentId: string) => void
  setActiveDocumentId: (id: string | null) => void
  updateDocumentContent: (documentId: string, content: string) => void
  updateDocumentTitle: (documentId: string, title: string) => Promise<void>
  deleteDocument: (documentId: string) => Promise<void>

  // References
  references: Reference[]
  selectedReferenceId: string | null
  referenceContent: string
  fetchReferences: () => Promise<void>
  createReference: () => Promise<void>
  selectReference: (referenceId: string) => void
  updateReferenceContent: (content: string) => void
  updateReferenceTitle: (referenceId: string, title: string) => Promise<void>
  saveReferenceContent: () => Promise<void>
  deleteReference: (referenceId: string) => Promise<void>

  // UI State
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  sidebarWidth: number
  setSidebarWidth: (width: number) => void
  aiAssistantWidth: number
  setAIAssistantWidth: (width: number) => void
}

// Helper to strip HTML tags
const stripHtml = (html: string): string => {
  if (typeof document === 'undefined') return html
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export const useAppStore = create<AppState>((set, get) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Selections & AI
  selectedText: '',
  selections: [],
  pendingModifications: [],
  setSelectedText: (text) => set({ selectedText: text }),

  addSelection: (text) => {
    const { selections } = get()
    if (!text.trim()) return
    if (selections.some(s => s.text === text)) return

    const newSelection = {
      id: Date.now().toString(),
      text: text,
    }
    set({ selections: [...selections, newSelection], selectedText: text })
  },

  removeSelection: (id) => set((state) => ({
    selections: state.selections.filter(s => s.id !== id)
  })),

  clearSelections: () => set({ selections: [], selectedText: '' }),

  applyChanges: (modifications) => {
    const { activeDocumentId, documentContents, updateDocumentContent } = get()
    if (!activeDocumentId) return

    let newContent = documentContents[activeDocumentId] || ''
    const isHtmlContent = newContent.includes('<') && newContent.includes('>')

    if (isHtmlContent && typeof document !== 'undefined') {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = newContent

      modifications.forEach((mod) => {
        const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null)
        const textNodes: Text[] = []
        let node
        while ((node = walker.nextNode())) {
          textNodes.push(node as Text)
        }

        textNodes.forEach((textNode) => {
          if (textNode.nodeValue && textNode.nodeValue.includes(mod.original)) {
            textNode.nodeValue = textNode.nodeValue.replace(mod.original, mod.modified)
          }
        })
      })

      newContent = tempDiv.innerHTML
    } else {
      modifications.forEach((mod) => {
        newContent = newContent.replace(mod.original, mod.modified)
      })
    }

    updateDocumentContent(activeDocumentId, newContent)

    const modificationsWithIds = modifications.map((mod) => ({
      id: Date.now().toString() + Math.random().toString(36),
      original: mod.original,
      modified: mod.modified,
    }))

    set({ pendingModifications: modificationsWithIds })
  },

  acceptChanges: () => {
    set({ pendingModifications: [], selections: [], selectedText: '' })
    toast.success('Changes accepted!')
  },

  rejectChanges: () => {
    const { activeDocumentId, documentContents, pendingModifications, updateDocumentContent } = get()
    if (!activeDocumentId || pendingModifications.length === 0) return

    let newContent = documentContents[activeDocumentId] || ''
    const isHtmlContent = newContent.includes('<') && newContent.includes('>')

    if (isHtmlContent && typeof document !== 'undefined') {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = newContent

      pendingModifications.forEach((mod) => {
        const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null)
        const textNodes: Text[] = []
        let node
        while ((node = walker.nextNode())) {
          textNodes.push(node as Text)
        }

        textNodes.forEach((textNode) => {
          if (textNode.nodeValue && textNode.nodeValue.includes(mod.modified)) {
            textNode.nodeValue = textNode.nodeValue.replace(mod.modified, mod.original)
          }
        })
      })

      newContent = tempDiv.innerHTML
    } else {
      pendingModifications.forEach((mod) => {
        newContent = newContent.replace(mod.modified, mod.original)
      })
    }

    updateDocumentContent(activeDocumentId, newContent)
    set({ pendingModifications: [], selections: [], selectedText: '' })
    toast.success('Changes rejected!')
  },

  // Documents
  documents: [],
  openDocuments: [],
  activeDocumentId: null,
  documentContents: {},

  fetchDocuments: async () => {
    const { user } = get()
    if (!user) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      set({ documents: data || [] })
    } catch (error: any) {
      toast.error('Failed to load documents: ' + error.message)
    }
  },

  createDocument: async () => {
    const { user, documents, openDocuments, documentContents } = get()
    if (!user) return

    try {
      const supabase = createClient()
      const newDoc = {
        user_id: user.id,
        title: `Document ${documents.length + 1}`,
        content: '',
        reference_content: '',
      }

      const { data, error } = await supabase
        .from('documents')
        .insert([newDoc])
        .select()
        .single()

      if (error) throw error

      set({
        documents: [data, ...documents],
        openDocuments: [...openDocuments, data],
        documentContents: { ...documentContents, [data.id]: '' },
        activeDocumentId: data.id,
      })

      toast.success('Document created!')
    } catch (error: any) {
      toast.error('Failed to create document: ' + error.message)
    }
  },

  openDocument: (documentId) => {
    const { documents, openDocuments, documentContents } = get()
    const doc = documents.find(d => d.id === documentId)
    if (!doc) return

    if (openDocuments.find(d => d.id === documentId)) {
      set({ activeDocumentId: documentId })
      toast('Document already open', { icon: 'ℹ️' })
      return
    }

    set({
      openDocuments: [...openDocuments, doc],
      documentContents: { ...documentContents, [documentId]: doc.content },
      activeDocumentId: documentId,
    })
  },

  closeDocument: (documentId) => {
    const { openDocuments, documentContents, activeDocumentId } = get()
    const newOpenDocs = openDocuments.filter(d => d.id !== documentId)
    const newContents = { ...documentContents }
    delete newContents[documentId]

    let newActiveId = activeDocumentId
    if (activeDocumentId === documentId && openDocuments.length > 1) {
      newActiveId = newOpenDocs[0]?.id || null
    }

    set({
      openDocuments: newOpenDocs,
      documentContents: newContents,
      activeDocumentId: newActiveId,
    })
  },

  setActiveDocumentId: (id) => set({ activeDocumentId: id }),

  updateDocumentContent: (documentId, content) => {
    const { documentContents, user } = get()
    const newContents = { ...documentContents, [documentId]: content }
    set({ documentContents: newContents })

    // Auto-save after 2 seconds
    setTimeout(async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('documents')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', documentId)

        if (error) throw error

        set((state) => ({
          documents: state.documents.map(d =>
            d.id === documentId ? { ...d, content, updated_at: new Date().toISOString() } : d
          )
        }))
      } catch (error: any) {
        console.error('Document autosave failed:', error.message)
      }
    }, 2000)
  },

  updateDocumentTitle: async (documentId, title) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('documents')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', documentId)

      if (error) throw error

      set((state) => ({
        documents: state.documents.map(d =>
          d.id === documentId ? { ...d, title, updated_at: new Date().toISOString() } : d
        ),
        openDocuments: state.openDocuments.map(d =>
          d.id === documentId ? { ...d, title } : d
        )
      }))
    } catch (error: any) {
      toast.error('Failed to update title: ' + error.message)
    }
  },

  deleteDocument: async (documentId) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error

      const { openDocuments, documentContents, activeDocumentId } = get()
      const newOpenDocs = openDocuments.filter(d => d.id !== documentId)
      const newContents = { ...documentContents }
      delete newContents[documentId]

      let newActiveId = activeDocumentId
      if (activeDocumentId === documentId) {
        newActiveId = newOpenDocs[0]?.id || null
      }

      set((state) => ({
        documents: state.documents.filter(d => d.id !== documentId),
        openDocuments: newOpenDocs,
        documentContents: newContents,
        activeDocumentId: newActiveId,
      }))

      toast.success('Document deleted')
    } catch (error: any) {
      toast.error('Failed to delete document: ' + error.message)
    }
  },

  // References
  references: [],
  selectedReferenceId: null,
  referenceContent: '',

  fetchReferences: async () => {
    const { user } = get()
    if (!user) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('references')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      set({ references: data || [] })
    } catch (error: any) {
      toast.error('Failed to load references: ' + error.message)
    }
  },

  createReference: async () => {
    const { user, references } = get()
    if (!user) return

    try {
      const supabase = createClient()
      const newRef = {
        user_id: user.id,
        title: `Reference ${references.length + 1}`,
        content: '',
      }

      const { data, error } = await supabase
        .from('references')
        .insert([newRef])
        .select()
        .single()

      if (error) throw error

      set({
        references: [data, ...references],
        selectedReferenceId: data.id,
      })

      toast.success('Reference created!')
    } catch (error: any) {
      toast.error('Failed to create reference: ' + error.message)
    }
  },

  selectReference: (referenceId) => {
    const { references } = get()
    const ref = references.find(r => r.id === referenceId)

    set({
      selectedReferenceId: referenceId || null,
      referenceContent: ref ? ref.content : '',
    })
  },

  updateReferenceContent: (content) => set({ referenceContent: content }),

  saveReferenceContent: async () => {
    const { selectedReferenceId, referenceContent } = get()
    if (!selectedReferenceId) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('references')
        .update({ content: referenceContent, updated_at: new Date().toISOString() })
        .eq('id', selectedReferenceId)

      if (error) throw error

      set((state) => ({
        references: state.references.map(r =>
          r.id === selectedReferenceId
            ? { ...r, content: referenceContent, updated_at: new Date().toISOString() }
            : r
        )
      }))
    } catch (error: any) {
      console.error('Reference save failed:', error.message)
    }
  },

  updateReferenceTitle: async (referenceId, title) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('references')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', referenceId)

      if (error) throw error

      set((state) => ({
        references: state.references.map(r =>
          r.id === referenceId ? { ...r, title, updated_at: new Date().toISOString() } : r
        )
      }))
    } catch (error: any) {
      toast.error('Failed to update title: ' + error.message)
    }
  },

  deleteReference: async (referenceId) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('references')
        .delete()
        .eq('id', referenceId)

      if (error) throw error

      const { selectedReferenceId } = get()

      set((state) => ({
        references: state.references.filter(r => r.id !== referenceId),
        selectedReferenceId: selectedReferenceId === referenceId ? null : selectedReferenceId,
        referenceContent: selectedReferenceId === referenceId ? '' : state.referenceContent,
      }))

      toast.success('Reference deleted')
    } catch (error: any) {
      toast.error('Failed to delete reference: ' + error.message)
    }
  },

  // UI State
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  sidebarWidth: 320,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  aiAssistantWidth: 384,
  setAIAssistantWidth: (width) => set({ aiAssistantWidth: width }),
}))
