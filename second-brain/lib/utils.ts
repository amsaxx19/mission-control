import { format, parseISO, isToday, isYesterday } from 'date-fns'

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  
  return format(date, 'MMM d, yyyy')
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
}

export function getRelativeTime(dateString: string): string {
  const date = parseISO(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  
  return format(date, 'MMM d, yyyy')
}