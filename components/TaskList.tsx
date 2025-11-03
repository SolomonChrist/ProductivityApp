import React, { useState } from 'react';
import { Task } from '../types';
import { TrashIcon } from './Icons';

interface TaskListProps {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, addTask, toggleTask, deleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTaskText);
    setNewTaskText('');
  };

  const copyToClipboard = () => {
    const taskListString = tasks.map(t => `${t.completed ? '[x]' : '[ ]'} ${t.text}`).join('\n');
    navigator.clipboard.writeText(taskListString);
    // Optional: Add a toast notification for feedback
  };

  const exportAsTxt = () => {
    const taskListString = tasks.map(t => `${t.completed ? '[x]' : '[ ]'} ${t.text}`).join('\r\n');
    const blob = new Blob([taskListString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TaskDownload.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
  };

  return (
    <aside className="w-full bg-gray-200 dark:bg-gray-900/50 p-6 flex flex-col h-screen">
      <h2 className="text-xl font-bold mb-4">Session Tasks</h2>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-[var(--active-color)]"
        />
        <button type="submit" className="bg-[var(--active-color)] text-white p-2 rounded-r-lg font-bold">+</button>
      </form>
      <ul className="flex-grow overflow-y-auto space-y-2 pr-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between group bg-white/50 dark:bg-gray-800/40 rounded-lg p-2">
            <div className="flex items-center flex-1 min-w-0">
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 rounded border-gray-300 text-[var(--active-color)] focus:ring-[var(--active-color)] flex-shrink-0"
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`ml-3 text-gray-800 dark:text-gray-300 truncate cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {task.text}
                </label>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              aria-label={`Delete task: ${task.text}`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex space-x-2 text-sm">
        <button onClick={copyToClipboard} className="flex-1 py-2 px-4 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition">Copy</button>
        <button onClick={exportAsTxt} className="flex-1 py-2 px-4 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition">Export .txt</button>
      </div>
    </aside>
  );
};

export default TaskList;
