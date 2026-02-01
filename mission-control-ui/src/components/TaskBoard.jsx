import { useState } from 'react'
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Flag, 
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react'

const columns = [
  { id: 'inbox', label: 'Inbox', color: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30' },
  { id: 'assigned', label: 'Assigned', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { id: 'in_progress', label: 'In Progress', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { id: 'review', label: 'Review', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30' },
  { id: 'done', label: 'Done', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
]

const priorityConfig = {
  high: { color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: '🔥' },
  medium: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: '⚡' },
  low: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: '📌' },
}

export default function TaskBoard({ tasks }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [filter, setFilter] = useState('all')

  // Default tasks if empty
  const displayTasks = tasks.length > 0 ? tasks : [
    { id: 1, title: 'Morning Briefing Automation', status: 'in_progress', priority: 'high', assignee: 'Friday', created_at: new Date().toISOString() },
    { id: 2, title: 'TikTok Competitor Analysis', status: 'done', priority: 'high', assignee: 'Shuri', created_at: new Date().toISOString() },
    { id: 3, title: 'Email System Deployment', status: 'review', priority: 'medium', assignee: 'Friday', created_at: new Date().toISOString() },
    { id: 4, title: 'Landing Page Copy', status: 'done', priority: 'medium', assignee: 'Loki', created_at: new Date().toISOString() },
    { id: 5, title: 'Content Calendar Week 1', status: 'done', priority: 'low', assignee: 'Loki', created_at: new Date().toISOString() },
  ]

  const getTasksByStatus = (status) => displayTasks.filter(t => t.status === status)

  const totalTasks = displayTasks.length
  const completedTasks = displayTasks.filter(t => t.status === 'done').length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Task Board</h2>
            <p className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} completed ({progress}%)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-all-300">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all-300 glow">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-2">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          
          return (
            <div key={column.id} className="min-w-[220px]">
              {/* Column Header */}
              <div className={`p-3 rounded-xl bg-gradient-to-r ${column.color} border ${column.border}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{column.label}</span>
                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>
              
              {/* Tasks */}
              <div className="space-y-3 mt-3">
                {columnTasks.map((task) => {
                  const priority = priorityConfig[task.priority] || priorityConfig.low
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="group glass-card p-4 cursor-pointer hover:border-primary/30 transition-all-300 hover:glow"
                    >
                      {/* Priority Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${priority.color}`}>
                          <Flag className="w-3 h-3" />
                          {task.priority}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all-300">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      
                      {/* Title */}
                      <h4 className="font-medium text-sm mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {task.title}
                      </h4>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs">
                            {task.assignee?.[0] || '?'}
                          </div>
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {/* Add Task Button */}
                <button className="w-full py-3 rounded-xl border border-dashed border-white/10 hover:border-primary/30 hover:bg-white/5 text-muted-foreground hover:text-foreground text-sm transition-all-300 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}