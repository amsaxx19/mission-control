import { useState, useEffect } from 'react'
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

  // Local-only storage (no Supabase/cloud)
  const [localTasks, setLocalTasks] = useState(() => {
    const saved = localStorage.getItem('mission-control-tasks')
    if (saved) return JSON.parse(saved)
    return [
      // === COMPLETED TODAY (Feb 2) ===
      { id: 'FEB2-001', title: '90 Viral Hooks Complete', status: 'done', priority: 'high', assignee: 'Shuri/Loki', created_at: '2026-02-02T12:00:00Z' },
      { id: 'FEB2-002', title: 'Day 1 Series Scripts (10 Episodes)', status: 'done', priority: 'high', assignee: 'Loki', created_at: '2026-02-02T12:00:00Z' },
      { id: 'FEB2-003', title: 'TikTok Competitor Intelligence Report', status: 'done', priority: 'high', assignee: 'Shuri', created_at: '2026-02-02T12:00:00Z' },
      { id: 'FEB2-004', title: 'CuanBoss Landing Page Copy', status: 'done', priority: 'medium', assignee: 'Loki', created_at: '2026-02-02T12:00:00Z' },
      { id: 'FEB2-005', title: '20 Variasi Script FYP', status: 'done', priority: 'high', assignee: 'Shuri', created_at: '2026-02-02T12:00:00Z' },
      { id: 'FEB2-006', title: 'Product Analysis Top 20', status: 'done', priority: 'medium', assignee: 'Shuri', created_at: '2026-02-02T12:00:00Z' },
      { id: 'FEB2-007', title: 'Push All to Notion', status: 'done', priority: 'high', assignee: 'System', created_at: '2026-02-02T12:00:00Z' },
      { id: 'FEB2-008', title: 'Mission Control UI Local Storage', status: 'done', priority: 'medium', assignee: 'Friday', created_at: '2026-02-02T12:00:00Z' },
      
      // === COMPLETED PREVIOUSLY ===
      { id: 'ARCH-001', title: 'Email System Setup', status: 'done', priority: 'medium', assignee: 'Friday', created_at: '2026-01-30T00:00:00Z' },
      { id: 'ARCH-002', title: 'Mission Control UI v1', status: 'done', priority: 'high', assignee: 'Friday', created_at: '2026-01-28T00:00:00Z' },
      { id: 'ARCH-003', title: 'Agent System Architecture', status: 'done', priority: 'high', assignee: 'Friday', created_at: '2026-01-25T00:00:00Z' },
      { id: 'ARCH-004', title: 'Notion Integration', status: 'done', priority: 'medium', assignee: 'Friday', created_at: '2026-01-27T00:00:00Z' },
      { id: 'ARCH-005', title: 'Shuri Initial Research', status: 'done', priority: 'high', assignee: 'Shuri', created_at: '2026-01-29T00:00:00Z' },
      
      // === IN PROGRESS ===
      { id: 'WIP-001', title: 'CuanBoss MVP Deployment', status: 'in_progress', priority: 'high', assignee: 'Friday', created_at: '2026-02-02T00:00:00Z' },
      { id: 'WIP-002', title: 'Morning Briefing Automation', status: 'in_progress', priority: 'medium', assignee: 'Friday', created_at: '2026-02-02T00:00:00Z' },
      { id: 'WIP-003', title: 'SOP Documentation for Adek', status: 'in_progress', priority: 'medium', assignee: 'Wong', created_at: '2026-02-02T00:00:00Z' },
      { id: 'WIP-004', title: 'Payment Gateway Integration', status: 'in_progress', priority: 'high', assignee: 'Friday', created_at: '2026-02-01T00:00:00Z' },
      
      // === BACKLOG / QUEUED ===
      { id: 'BACK-001', title: 'TikTok Content Automation', status: 'inbox', priority: 'medium', assignee: 'Unassigned', created_at: '2026-02-03T00:00:00Z' },
      { id: 'BACK-002', title: 'Kalodata Daily Scraper', status: 'inbox', priority: 'medium', assignee: 'Friday', created_at: '2026-02-03T00:00:00Z' },
      { id: 'BACK-003', title: 'Affiliate Dashboard Analytics', status: 'inbox', priority: 'low', assignee: 'Friday', created_at: '2026-02-03T00:00:00Z' },
      { id: 'BACK-004', title: 'Adek Training Modules', status: 'inbox', priority: 'medium', assignee: 'Wong', created_at: '2026-02-03T00:00:00Z' },
      { id: 'BACK-005', title: 'CuanBoss Seller Onboarding Flow', status: 'inbox', priority: 'high', assignee: 'Friday', created_at: '2026-02-03T00:00:00Z' },
      { id: 'BACK-006', title: 'Email Newsletter System', status: 'inbox', priority: 'low', assignee: 'Loki', created_at: '2026-02-03T00:00:00Z' },
      { id: 'BACK-007', title: 'Competitor Monitoring Alert', status: 'inbox', priority: 'medium', assignee: 'Shuri', created_at: '2026-02-03T00:00:00Z' },
      { id: 'BACK-008', title: 'Content Calendar Auto-Generator', status: 'inbox', priority: 'low', assignee: 'Loki', created_at: '2026-02-03T00:00:00Z' },
      
      // === REVIEW / WAITING ===
      { id: 'REV-001', title: 'Super Fast Mode Documentation', status: 'review', priority: 'low', assignee: 'System', created_at: '2026-02-02T00:00:00Z' },
      { id: 'REV-002', title: 'Agent Inbox System Refactor', status: 'review', priority: 'medium', assignee: 'Friday', created_at: '2026-02-02T00:00:00Z' },
      
      // === FUTURE / ICEBOX ===
      { id: 'ICE-001', title: 'Mobile App for CuanBoss', status: 'assigned', priority: 'low', assignee: 'Friday', created_at: '2026-03-01T00:00:00Z' },
      { id: 'ICE-002', title: 'AI Video Generator Integration', status: 'assigned', priority: 'low', assignee: 'Loki', created_at: '2026-03-01T00:00:00Z' },
      { id: 'ICE-003', title: 'WhatsApp Business API', status: 'assigned', priority: 'medium', assignee: 'Friday', created_at: '2026-02-15T00:00:00Z' },
      { id: 'ICE-004', title: 'Podcast Production System', status: 'assigned', priority: 'low', assignee: 'Loki', created_at: '2026-03-01T00:00:00Z' },
      { id: 'ICE-005', title: 'YouTube Automation Pipeline', status: 'assigned', priority: 'medium', assignee: 'Loki', created_at: '2026-02-20T00:00:00Z' },
    ]
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('mission-control-tasks', JSON.stringify(localTasks))
  }, [localTasks])

  const displayTasks = tasks.length > 0 ? tasks : localTasks

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
          <button 
            onClick={() => { localStorage.removeItem('mission-control-tasks'); window.location.reload(); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-all-300 text-amber-400"
            title="Reset to latest tasks"
          >
            <Clock className="w-4 h-4" />
            Refresh
          </button>
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
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ minHeight: '500px' }}>
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          
          return (
            <div key={column.id} className="flex-shrink-0 w-[260px]">
              {/* Column Header */}
              <div className={`p-3 rounded-xl bg-gradient-to-r ${column.color} border ${column.border}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate">{column.label}</span>
                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full flex-shrink-0">
                    {columnTasks.length}
                  </span>
                </div>
              </div>
              
              {/* Tasks */}
              <div className="space-y-3 mt-3 max-h-[600px] overflow-y-auto">
                {columnTasks.map((task) => {
                  const priority = priorityConfig[task.priority] || priorityConfig.low
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="group glass-card p-3 cursor-pointer hover:border-primary/30 transition-all-300 hover:glow"
                    >
                      {/* Priority Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${priority.color}`}>
                          <Flag className="w-3 h-3" />
                          {task.priority}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all-300">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      
                      {/* Title */}
                      <h4 className="font-medium text-sm mb-2 leading-snug" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {task.title}
                      </h4>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs flex-shrink-0">
                            {task.assignee?.[0] || '?'}
                          </div>
                          <span className="text-xs text-muted-foreground truncate">{task.assignee}</span>
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