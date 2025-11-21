interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <div
      className={`flex items-start gap-4 p-5 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 hover:translate-x-1 ${
        todo.completed ? 'opacity-70' : ''
      }`}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`mt-1 w-6 h-6 min-w-[24px] rounded-md border-2 flex items-center justify-center transition-all hover:scale-110 ${
          todo.completed
            ? 'bg-primary border-primary text-white'
            : 'border-primary bg-white'
        }`}
      >
        {todo.completed && '✓'}
      </button>

      <div className="flex-1">
        <h3
          className={`text-lg font-semibold text-gray-900 mb-1 ${
            todo.completed ? 'line-through' : ''
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p className="text-gray-600 text-sm">{todo.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-all"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
