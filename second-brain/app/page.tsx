'use client'

import { useState, useEffect } from 'react'
import { Document, getAllDocuments, getDocumentBySlug } from '@/lib/documents'
import { Sidebar } from '@/components/Sidebar'
import { DocumentViewer } from '@/components/DocumentViewer'
import { FileText } from 'lucide-react'

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Load documents from localStorage or fetch
    const docs = getAllDocuments()
    setDocuments(docs)
    
    // Try to load most recent daily note
    const dailyNotes = docs.filter(d => d.type === 'daily')
    if (dailyNotes.length > 0) {
      loadDocument(dailyNotes[0].type, dailyNotes[0].slug)
    } else if (docs.length > 0) {
      loadDocument(docs[0].type, docs[0].slug)
    }
    
    setLoading(false)
  }, [])
  
  const loadDocument = async (type: string, slug: string) => {
    const doc = await getDocumentBySlug(type, slug)
    if (doc) {
      setCurrentDoc(doc)
    }
  }
  
  const handleSelectDoc = (doc: Document) => {
    loadDocument(doc.type, doc.slug)
  }
  
  const handleLinkClick = (title: string) => {
    // Find document by title
    const linkedDoc = documents.find(d => 
      d.title.toLowerCase() === title.toLowerCase() ||
      d.slug.toLowerCase() === title.toLowerCase().replace(/\s+/g, '-')
    )
    
    if (linkedDoc) {
      loadDocument(linkedDoc.type, linkedDoc.slug)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-bg text-linear-text">
        Loading...
      </div>
    )
  }
  
  return (
    <div className="flex h-screen bg-linear-bg">
      <Sidebar 
        documents={documents} 
        currentDoc={currentDoc || undefined}
        onSelectDoc={handleSelectDoc}
      />
      
      {currentDoc ? (
        <DocumentViewer 
          document={currentDoc}
          allDocuments={documents}
          onLinkClick={handleLinkClick}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-linear-muted mx-auto mb-4" />
            <h2 className="text-xl font-medium text-linear-text mb-2">No documents yet</h2>
            <p className="text-linear-muted">Start creating documents in the docs/ folder</p>
          </div>
        </div>
      )}
    </div>
  )
}