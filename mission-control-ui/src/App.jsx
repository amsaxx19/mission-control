import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { 
  Zap, 
  Users, 
  CheckCircle2, 
  Clock, 
  Activity,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Settings
} from 'lucide-react'
import AgentCards from './components/AgentCards'
import TaskBoard from './components/TaskBoard'
import ActivityFeed from './components/ActivityFeed'
import Stats from './components/Stats'

function App() {
  const [agents, setAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    fetchData()
    setupRealtime()
  }, [])

  async function fetchData() {
    const [{ data: agentsData }, { data: tasksData }, { data: activitiesData }] = await Promise.all([
      supabase.from('agents').select('*').order('name'),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(20)
    ])

    setAgents(agentsData || [])
    setTasks(tasksData || [])
    setActivities(activitiesData || [])
    setLoading(false)
  }

  function setupRealtime() {
    const channel = supabase
      .channel('mission-control')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchData)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-primary/30 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 animate-pulse-slow">
              <Sparkles className="w-6 h-6 text-primary/50 absolute -top-2 -right-2" />
            </div>
          </div>
          <p className="text-muted-foreground animate-pulse">Initializing Mission Control...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'activity', label: 'Activity', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass-card m-4 mr-0 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">Mission Control</h1>
              <p className="text-xs text-muted-foreground">AI Squad Manager</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all-300 ${
                  activeTab === item.id
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all-300">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
            <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">3</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all-300">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 m-4 ml-4 overflow-auto">
        {/* Header */}
        <header className="glass-card p-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">System Online</span>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all-300 glow">
              + New Task
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <>
              <Stats agents={agents} tasks={tasks} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                  <AgentCards agents={agents} />
                  <TaskBoard tasks={tasks} />
                </div>
                <div className="lg:col-span-1">
                  <ActivityFeed activities={activities} />
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <AgentCards agents={agents} />
            </div>
          )}
          
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <TaskBoard tasks={tasks} />
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <ActivityFeed activities={activities} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App