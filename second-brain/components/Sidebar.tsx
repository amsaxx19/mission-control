'use client'

import { useState } from 'react'
import { Document } from '@/lib/documents'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/utils'
import { 
  FileText, 
  Calendar, 
  Lightbulb, 
  Users, 
  FolderGit2, 
  Search,
  ChevronRight,
  ChevronDown,
  Clock
} from 'lucide-react'

interface SidebarProps {
  documents: Document[]
  currentDoc?: Document
  onSelectDoc: (doc: Document) => void
}

const typeIcons = {
  daily: Calendar,
  concept: Lightbulb,
  project: FolderGit2,
  person: Users,
  idea: FileText,
}

const typeLabels = {
  daily: 'Daily Notes',
  concept: 'Concepts',
  project: 'Projects',
  person: 'People',
  idea: 'Ideas',
}

export function Sidebar({ documents, currentDoc, onSelectDoc }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['daily', 'concept']))
  
  const filteredDocs = searchQuery
    ? documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents
  
  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = []
    acc[doc.type].push(doc)
    return acc
  }, {} as Record<string, Document[]>)
  
  const toggleType = (type: string) => {
    setExpandedTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }
  
  return (
    <div className="w-72 bg-linear-sidebar border-r border-linear-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-linear-border">
        <h1 className="text-lg font-semibold text-linear-text mb-3">2nd Brain</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-linear-muted" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-linear-surface border border-linear-border rounded-md py-2 pl-9 pr-3 text-sm text-linear-text placeholder-linear-muted focus:outline-none focus:border-linear-accent"
          />
        </div>
      </div>
      
      {/* Document List */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Recent Section */}
        <div className="px-3 mb-4">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-linear-muted uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Recent
          </div>
          {documents.slice(0, 5).map(doc => (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc)}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                currentDoc?.id === doc.id
                  ? "bg-linear-accent text-white"
                  : "text-linear-muted hover:bg-linear-surface hover:text-linear-text"
              )}
            >
              <div className="truncate">{doc.title}</div>
              <div className={cn(
                "text-xs mt-0.5",
                currentDoc?.id === doc.id ? "text-white/70" : "text-linear-muted/70"
              )}>
                {formatDate(doc.date)}
              </div>
            </button>
          ))}
        </div>
        
        {/* Grouped by Type */}
        {Object.entries(typeLabels).map(([type, label]) => {
          const Icon = typeIcons[type as keyof typeof typeIcons]
          const docs = groupedDocs[type] || []
          const isExpanded = expandedTypes.has(type)
          
          if (!searchQuery && docs.length === 0) return null
          
          return (
            <div key={type} className="px-3 mb-2">
              <button
                onClick={() => toggleType(type)}
                className="flex items-center gap-2 px-2 py-1.5 w-full text-xs font-medium text-linear-muted uppercase tracking-wider hover:text-linear-text transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <Icon className="w-3.5 h-3.5" />
                {label}
                <span className="ml-auto text-xs text-linear-muted/60">{docs.length}</span>
              </button>
              
              {isExpanded && (
                <div className="mt-1 space-y-0.5">
                  {docs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => onSelectDoc(doc)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                        currentDoc?.id === doc.id
                          ? "bg-linear-accent text-white"
                          : "text-linear-muted hover:bg-linear-surface hover:text-linear-text"
                      )}
                    >
                      <div className="truncate">{doc.title}</div>
                      <div className={cn(
                        "text-xs mt-0.5",
                        currentDoc?.id === doc.id ? "text-white/70" : "text-linear-muted/70"
                      )}>
                        {formatDate(doc.date)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Stats */}
      <div className="p-3 border-t border-linear-border">
        <div className="text-xs text-linear-muted">
          {documents.length} documents
        </div>
      </div>
    </div>
  )
}