'use client'

import { Document } from '@/lib/documents'
import { formatDateTime } from '@/lib/utils'
import { Tag, Calendar, Link2 } from 'lucide-react'

interface DocumentViewerProps {
  document: Document
  allDocuments: Document[]
  onLinkClick: (title: string) => void
}

export function DocumentViewer({ document, allDocuments, onLinkClick }: DocumentViewerProps) {
  // Find linked documents
  const linkedDocs = document.links
    .map(linkTitle => allDocuments.find(d => 
      d.title.toLowerCase() === linkTitle.toLowerCase() ||
      d.slug.toLowerCase() === linkTitle.toLowerCase().replace(/\s+/g, '-')
    ))
    .filter(Boolean) as Document[]
  
  // Find documents that link to this one
  const backlinkedDocs = allDocuments.filter(doc => 
    doc.links.some(link => 
      link.toLowerCase() === document.title.toLowerCase() ||
      link.toLowerCase().replace(/\s+/g, '-') === document.slug.toLowerCase()
    )
  )
  
  // Process content to make [[links]] clickable
  const processedContent = document.contentHtml.replace(
    /\[\[([^\]]+)\]\]/g,
    '<a href="#" data-link="$1" class="text-linear-accent hover:underline cursor-pointer">$1</a>'
  )
  
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.dataset.link) {
      e.preventDefault()
      onLinkClick(target.dataset.link)
    }
  }
  
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-8 py-6 border-b border-linear-border">
        <div className="flex items-center gap-2 text-sm text-linear-muted mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDateTime(document.date)}</span>
          <span className="mx-2">·</span>
          <span className="capitalize">{document.type}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-linear-text mb-4">
          {document.title}
        </h1>
        
        {document.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-linear-muted" />
            {document.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-0.5 bg-linear-surface text-linear-muted text-xs rounded-full border border-linear-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="px-8 py-6 max-w-3xl">
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: processedContent }}
          onClick={handleClick}
        />
        
        {/* Links Section */}
        {(linkedDocs.length > 0 || backlinkedDocs.length > 0) && (
          <div className="mt-12 pt-8 border-t border-linear-border">
            <div className="flex items-center gap-2 text-sm font-medium text-linear-text mb-4">
              <Link2 className="w-4 h-4" />
              Connections
            </div>
            
            {linkedDocs.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-linear-muted mb-2 uppercase tracking-wider">Links to</div>
                <div className="flex flex-wrap gap-2">
                  {linkedDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => onLinkClick(doc.title)}
                      className="px-3 py-1.5 bg-linear-surface text-linear-text text-sm rounded-md border border-linear-border hover:border-linear-accent transition-colors"
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {backlinkedDocs.length > 0 && (
              <div>
                <div className="text-xs text-linear-muted mb-2 uppercase tracking-wider">Linked from</div>
                <div className="flex flex-wrap gap-2">
                  {backlinkedDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => onLinkClick(doc.title)}
                      className="px-3 py-1.5 bg-linear-surface text-linear-text text-sm rounded-md border border-linear-border hover:border-linear-accent transition-colors"
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}