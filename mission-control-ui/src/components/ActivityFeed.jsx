import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ArrowUpRight
} from 'lucide-react'

const activityIcons = {
  task_created: { icon: CheckCircle2, color: 'text-blue-400 bg-blue-500/10' },
  task_completed: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
  message_sent: { icon: MessageSquare, color: 'text-purple-400 bg-purple-500/10' },
  agent_wakeup: { icon: Activity, color: 'text-amber-400 bg-amber-500/10' },
}

export default function ActivityFeed({ activities }) {
  // Default activities if empty
  const displayActivities = activities.length > 0 ? activities : [
    { id: 1, type: 'task_completed', message: 'Shuri completed TikTok competitor analysis', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 2, type: 'task_created', message: 'Jarvis assigned TASK-007 to Vision and Loki', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 3, type: 'message_sent', message: 'Friday reported cron API timeout issue', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: 4, type: 'task_completed', message: 'Loki delivered landing page copy', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    { id: 5, type: 'agent_wakeup', message: 'All agents completed heartbeat check', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  ]

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 1000 * 60) return 'Just now'
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Activity Feed</h2>
            <p className="text-sm text-muted-foreground">Recent squad updates</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-all-300">
          <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => {
          const config = activityIcons[activity.type] || activityIcons.agent_wakeup
          const Icon = config.icon
          
          return (
            <div 
              key={activity.id || index} 
              className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all-300 cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-4 py-3 rounded-xl border border-white/10 hover:border-primary/30 hover:bg-white/5 text-muted-foreground hover:text-foreground text-sm transition-all-300">
        View All Activity
      </button>
    </div>
  )
}