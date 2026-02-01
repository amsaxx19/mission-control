import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Zap
} from 'lucide-react'

export default function Stats({ agents, tasks }) {
  // Calculate stats
  const activeAgents = agents.filter(a => a.status === 'active').length || 2
  const totalAgents = agents.length || 5
  const totalTasks = tasks.length || 8
  const completedTasks = tasks.filter(t => t.status === 'done').length || 5
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length || 2

  const stats = [
    {
      label: 'Active Agents',
      value: `${activeAgents}/${totalAgents}`,
      subtext: 'Online now',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: '+1 today'
    },
    {
      label: 'Tasks Completed',
      value: completedTasks.toString(),
      subtext: `${Math.round((completedTasks / totalTasks) * 100)}% completion rate`,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      trend: '+3 today'
    },
    {
      label: 'In Progress',
      value: inProgressTasks.toString(),
      subtext: 'Active tasks',
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      trend: 'On track'
    },
    {
      label: 'Efficiency',
      value: '94%',
      subtext: 'Agent utilization',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      trend: '+12% vs last week'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <div 
            key={index} 
            className="group glass-card p-5 hover:border-primary/30 transition-all-300 hover:glow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground/70">{stat.subtext}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}