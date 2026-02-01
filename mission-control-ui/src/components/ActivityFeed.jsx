import { MessageSquare, FileText, CheckCircle, AlertCircle, Plus } from 'lucide-react'

const activityIcons = {
  task_created: { icon: Plus, color: 'text-blue-600' },
  message_sent: { icon: MessageSquare, color: 'text-purple-600' },
  document_created: { icon: FileText, color: 'text-green-600' },
  task_completed: { icon: CheckCircle, color: 'text-success' },
  default: { icon: AlertCircle, color: 'text-muted' },
}

export default function ActivityFeed({ activities }) {
  return (
    <div className="newspaper-border bg-white p-6 newspaper-shadow sticky top-4">
      <h2 className="text-2xl font-serif font-bold mb-6 pb-2 border-b-2 border-ink/10">
        Latest News
      </h2>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-muted text-center py-8">No activity yet</p>
        ) : (
          activities.map((activity, index) => {
            const config = activityIcons[activity.type] || activityIcons.default
            const Icon = config.icon
            const time = new Date(activity.created_at).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })

            return (
              <div key={activity.id || index} className="flex gap-3 pb-4 border-b border-ink/5 last:border-0">
                <div className={`mt-0.5 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{activity.message}</p>
                  <p className="text-xs text-muted mt-1">{time}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}