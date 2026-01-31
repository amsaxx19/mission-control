import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import documentsData from './documents.json'

export interface Document {
  id: string
  slug: string
  title: string
  date: string
  type: 'daily' | 'concept' | 'project' | 'person' | 'idea'
  content: string
  contentHtml: string
  excerpt: string
  tags: string[]
  links: string[]
}

export function getAllDocuments(): Document[] {
  return documentsData as unknown as Document[]
}

export async function getDocumentBySlug(folder: string, slug: string): Promise<Document | null> {
  const id = `${folder}/${slug}`
  const doc = (documentsData as unknown as Document[]).find(d => d.id === id)
  if (!doc) return null
  
  // Process markdown to HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html, { allowDangerousHtml: true })
    .process(doc.content)
  
  return {
    ...doc,
    contentHtml: processedContent.toString()
  }
}

export function getDocumentsByType(type: Document['type']): Document[] {
  return (documentsData as unknown as Document[]).filter(doc => doc.type === type)
}

export function getRecentDocuments(limit: number = 10): Document[] {
  return (documentsData as unknown as Document[]).slice(0, limit)
}

export function searchDocuments(query: string): Document[] {
  const lowerQuery = query.toLowerCase()
  return (documentsData as unknown as Document[]).filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.content.toLowerCase().includes(lowerQuery) ||
    doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}