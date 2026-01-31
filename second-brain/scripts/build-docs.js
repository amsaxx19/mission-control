const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const docsDirectory = path.join(__dirname, '..', 'docs')
const outputFile = path.join(__dirname, '..', 'lib', 'documents.json')

function processDocument(folder, file) {
  const filePath = path.join(docsDirectory, folder, file)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const slug = file.replace(/\.md$/, '')
  const id = `${folder}/${slug}`
  
  // Extract links [[like this]]
  const linkRegex = /\[\[([^\]]+)\]\]/g
  const links = []
  let match
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1])
  }
  
  // Extract excerpt (first paragraph)
  const excerpt = content
    .replace(/#.*\n/, '')
    .trim()
    .split('\n')[0]
    .slice(0, 200) + (content.length > 200 ? '...' : '')
  
  return {
    id,
    slug,
    title: data.title || slug.replace(/-/g, ' '),
    date: data.date || new Date().toISOString().split('T')[0],
    type: folder,
    content,
    contentHtml: '', // Will be processed client-side
    excerpt,
    tags: data.tags || [],
    links,
  }
}

function generateDocuments() {
  const documents = []
  const folders = ['daily', 'concepts', 'projects', 'people', 'ideas']
  
  for (const folder of folders) {
    const folderPath = path.join(docsDirectory, folder)
    if (!fs.existsSync(folderPath)) continue
    
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'))
    
    for (const file of files) {
      const doc = processDocument(folder, file)
      documents.push(doc)
    }
  }
  
  // Sort by date descending
  documents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  fs.writeFileSync(outputFile, JSON.stringify(documents, null, 2))
  console.log(`Generated ${documents.length} documents`)
}

generateDocuments()