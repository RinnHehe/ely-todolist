import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TodoItem from '../components/TodoItem';
import AddTodoModal from '../components/AddTodoModal';
import EditTodoModal from '../components/EditTodoModal';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.error === 'Unauthorized') {
        logout();
        navigate('/');
        return;
      }
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });
      loadTodos();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await fetch(`/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">✓ Ely TodoList</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">My Tasks</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all hover:shadow-lg inline-flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard icon="📋" label="Total Tasks" value={totalTasks} />
          <StatCard icon="✅" label="Completed" value={completedTasks} />
          <StatCard icon="⏳" label="Pending" value={pendingTasks} />
        </div>

        {/* Todos Section */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          {/* Filter Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                label="All"
              />
              <FilterButton
                active={filter === 'pending'}
                onClick={() => setFilter('pending')}
                label="Pending"
              />
              <FilterButton
                active={filter === 'completed'}
                onClick={() => setFilter('completed')}
                label="Completed"
              />
            </div>
          </div>

          {/* Todo List */}
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">Loading your tasks...</div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 text-lg mb-6">Start by adding your first task!</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
              >
                Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onEdit={() => setEditingTodo(todo)}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddTodoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadTodos}
      />
      {editingTodo && (
        <EditTodoModal
          isOpen={!!editingTodo}
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onSuccess={loadTodos}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex items-center gap-4">
      <div className="text-5xl w-16 h-16 flex items-center justify-center bg-gray-100 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition-all flex-1 md:flex-none ${
        active
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}
