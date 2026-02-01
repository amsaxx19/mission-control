import { UserCircle, Activity, PauseCircle, AlertCircle } from 'lucide-react'

const statusConfig = {
  active: { icon: Activity, color: 'text-success', bg: 'bg-success/10', label: 'Active' },
  idle: { icon: PauseCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Idle' },
  blocked: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10', label: 'Blocked' },
}

const agentColors = {
  'Jarvis': 'bg-blue-500',
  'Shuri': 'bg-pink-500',
  'Friday': 'bg-green-500',
  'Loki': 'bg-yellow-500',
  'Wong': 'bg-purple-500',
}

export default function AgentCards({ agents }) {
  return (
    <div className="newspaper-border bg-white p-6 newspaper-shadow">
      <h2 className="text-2xl font-serif font-bold mb-6 pb-2 border-b-2 border-ink/10">
        The Squad
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const status = statusConfig[agent.status] || statusConfig.idle
          const StatusIcon = status.icon
          
          return (
            <div key={agent.id} className="newspaper-border p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${agentColors[agent.name] || 'bg-gray-500'} flex items-center justify-center text-white font-bold text-sm`}>
                  {agent.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{agent.name}</h3>
                  <p className="text-sm text-muted truncate">{agent.role}</p>
                  <div className={`flex items-center gap-1 mt-2 text-xs ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{status.label}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-ink/5 text-xs text-muted">
                {agent.session_key}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}