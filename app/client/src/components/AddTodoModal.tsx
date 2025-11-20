import { useState, FormEvent } from 'react';

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTodoModal({ isOpen, onClose, onSuccess }: AddTodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setTitle('');
      setDescription('');
      onSuccess();
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-gray-900 leading-none"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-900">Add New Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-10 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add more details..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-10 transition-all resize-vertical"
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
