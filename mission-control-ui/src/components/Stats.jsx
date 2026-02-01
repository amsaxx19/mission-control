import { Activity, Users, CheckCircle2, Clock } from 'lucide-react'

export default function Stats({ agents, tasks }) {
  const activeAgents = agents.filter(a => a.status === 'active').length
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length

  const stats = [
    { label: 'Active Agents', value: activeAgents, icon: Users, color: 'text-success' },
    { label: 'Done Today', value: doneTasks, icon: CheckCircle2, color: 'text-accent' },
    { label: 'In Progress', value: inProgressTasks, icon: Activity, color: 'text-warning' },
    { label: 'Total Tasks', value: tasks.length, icon: Clock, color: 'text-muted' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="newspaper-border bg-white p-6 newspaper-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold font-serif">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color} opacity-60`} />
          </div>
        </div>
      ))}
    </div>
  )
}