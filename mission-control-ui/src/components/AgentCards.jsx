import { 
  Activity, 
  PauseCircle, 
  AlertCircle, 
  MessageSquare, 
  Clock,
  MoreHorizontal,
  Cpu
} from 'lucide-react'

const statusConfig = {
  active: { 
    icon: Activity, 
    class: 'status-active',
    label: 'Active'
  },
  idle: { 
    icon: PauseCircle, 
    class: 'status-idle',
    label: 'Idle'
  },
  blocked: { 
    icon: AlertCircle, 
    class: 'status-blocked',
    label: 'Blocked'
  },
}

const agentColors = {
  'Jarvis': { bg: 'from-blue-500 to-cyan-500', icon: '👨‍✈️' },
  'Shuri': { bg: 'from-pink-500 to-rose-500', icon: '🔬' },
  'Friday': { bg: 'from-emerald-500 to-teal-500', icon: '💻' },
  'Loki': { bg: 'from-amber-500 to-orange-500', icon: '✍️' },
  'Wong': { bg: 'from-purple-500 to-violet-500', icon: '📚' },
}

export default function AgentCards({ agents }) {
  // Default agents if empty
  const displayAgents = agents.length > 0 ? agents : [
    { id: 1, name: 'Jarvis', role: 'Squad Lead', status: 'active', session_key: 'agent:main:main' },
    { id: 2, name: 'Shuri', role: 'Product Analyst', status: 'idle', session_key: 'agent:product-analyst:main' },
    { id: 3, name: 'Friday', role: 'Developer', status: 'active', session_key: 'agent:developer:main' },
    { id: 4, name: 'Loki', role: 'Content Writer', status: 'idle', session_key: 'agent:content-writer:main' },
    { id: 5, name: 'Wong', role: 'Documentation', status: 'idle', session_key: 'agent:notion-agent:main' },
  ]

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">The Squad</h2>
            <p className="text-sm text-muted-foreground">{displayAgents.filter(a => a.status === 'active').length} active agents</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-all-300">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayAgents.map((agent) => {
          const status = statusConfig[agent.status] || statusConfig.idle
          const StatusIcon = status.icon
          const colors = agentColors[agent.name] || { bg: 'from-gray-500 to-gray-600', icon: '🤖' }
          
          return (
            <div 
              key={agent.id} 
              className="group glass-card p-5 hover:border-primary/30 transition-all-300 cursor-pointer hover:glow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
                    {colors.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.class}`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              
              <div className="space-y-3">
                {/* Task Progress */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Task</span>
                  <span className="text-foreground font-medium">
                    {agent.status === 'active' ? 'In Progress' : 'No active task'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${colors.bg} transition-all-300`}
                    style={{ width: agent.status === 'active' ? '65%' : '0%' }}
                  ></div>
                </div>
                
                {/* Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last active: 2m ago</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-all-300">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}