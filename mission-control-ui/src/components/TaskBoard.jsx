import { useState } from 'react'
import { Plus, MoreHorizontal, Calendar, Flag } from 'lucide-react'

const columns = [
  { id: 'inbox', label: 'Inbox', color: 'bg-gray-100' },
  { id: 'assigned', label: 'Assigned', color: 'bg-blue-50' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-yellow-50' },
  { id: 'review', label: 'Review', color: 'bg-purple-50' },
  { id: 'done', label: 'Done', color: 'bg-green-50' },
]

const priorityColors = {
  high: 'text-red-600 bg-red-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50',
}

export default function TaskBoard({ tasks }) {
  const [selectedTask, setSelectedTask] = useState(null)

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status)

  return (
    <div className="newspaper-border bg-white p-6 newspaper-shadow">
      <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-ink/10">
        <h2 className="text-2xl font-serif font-bold">Task Board</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[200px]">
            <div className={`${column.color} px-3 py-2 rounded-t font-medium text-sm`}>
              {column.label}
              <span className="ml-2 text-muted">
                ({getTasksByStatus(column.id).length})
              </span>
            </div>
            <div className="space-y-2 mt-2">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="newspaper-border bg-white p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>
                  {task.priority && (
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                      <Flag className="w-3 h-3" />
                      {task.priority}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2 text-xs text-muted">
                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}