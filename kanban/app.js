// Kanban Board Data & Logic
let tasks = JSON.parse(localStorage.getItem('kanban-tasks')) || {};

const COLUMNS = ['backlog', 'in-progress', 'review', 'done'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    updateCounts();
    
    // Allow Enter key to add task
    document.getElementById('newTaskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});

// Generate unique ID
function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save to localStorage
function saveData() {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}

// Add new task
function addTask() {
    const input = document.getElementById('newTaskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const title = input.value.trim();
    
    if (!title) return;
    
    const task = {
        id: generateId(),
        title: title,
        priority: prioritySelect.value,
        status: 'backlog',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    tasks[task.id] = task;
    saveData();
    renderBoard();
    updateCounts();
    
    input.value = '';
}

// Delete task
function deleteTask(taskId) {
    if (confirm('Delete this task?')) {
        delete tasks[taskId];
        saveData();
        renderBoard();
        updateCounts();
    }
}

// Edit task
function editTask(taskId) {
    const task = tasks[taskId];
    const newTitle = prompt('Edit task:', task.title);
    if (newTitle !== null && newTitle.trim() !== '') {
        task.title = newTitle.trim();
        task.updatedAt = new Date().toISOString();
        saveData();
        renderBoard();
    }
}

// Create task card HTML
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.taskId = task.id;
    
    const date = new Date(task.createdAt).toLocaleDateString();
    
    card.innerHTML = `
        <span class="priority ${task.priority}">${task.priority}</span>
        <div class="title">${escapeHtml(task.title)}</div>
        <div class="meta">
            <span>${date}</span>
            <span>
                <button class="edit-btn" onclick="editTask('${task.id}')" title="Edit">✏️</button>
                <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Delete">×</button>
            </span>
        </div>
    `;
    
    // Drag events
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
    
    return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render board
function renderBoard() {
    COLUMNS.forEach(columnId => {
        const column = document.getElementById(columnId);
        column.innerHTML = '';
        
        Object.values(tasks)
            .filter(task => task.status === columnId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach(task => {
                column.appendChild(createTaskCard(task));
            });
    });
}

// Update column counts
function updateCounts() {
    COLUMNS.forEach(columnId => {
        const count = Object.values(tasks).filter(t => t.status === columnId).length;
        const column = document.querySelector(`[data-status="${columnId}"]`);
        column.querySelector('.count').textContent = count;
    });
}

// Drag & Drop
let draggedTask = null;

function dragStart(e) {
    draggedTask = tasks[e.target.dataset.taskId];
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
    });
}

function allowDrop(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    if (column) {
        column.classList.add('drag-over');
    }
}

function drop(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    
    document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
    });
    
    if (column && draggedTask) {
        const newStatus = column.dataset.status;
        if (newStatus !== draggedTask.status) {
            draggedTask.status = newStatus;
            draggedTask.updatedAt = new Date().toISOString();
            saveData();
            renderBoard();
            updateCounts();
        }
    }
    draggedTask = null;
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Import data
function importData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (confirm(`Import ${Object.keys(imported).length} tasks? This will merge with existing tasks.`)) {
                tasks = { ...tasks, ...imported };
                saveData();
                renderBoard();
                updateCounts();
                alert('Import successful!');
            }
        } catch (err) {
            alert('Invalid JSON file');
        }
    };
    reader.readAsText(file);
    input.value = '';
}
