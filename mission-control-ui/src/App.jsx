import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import AgentCards from './components/AgentCards'
import TaskBoard from './components/TaskBoard'
import ActivityFeed from './components/ActivityFeed'
import Stats from './components/Stats'

function App() {
  const [agents, setAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">Loading Mission Control...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Stats agents={agents} tasks={tasks} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <AgentCards agents={agents} />
            <TaskBoard tasks={tasks} />
          </div>
          
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App