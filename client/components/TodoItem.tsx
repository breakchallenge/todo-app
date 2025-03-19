import { FC } from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PriorityBadge: FC<{ priority: string }> = ({ priority }) => {
  const getColor = () => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColor()}`}>
      {priority}
    </span>
  );
};

const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const { id, title, description, completed, dueDate, priority } = todo;

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <li className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id)}
            className="mt-1 h-5 w-5 cursor-pointer"
          />
          <div>
            <h3
              className={`text-lg font-medium ${
                completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {title}
            </h3>
            {description && (
              <p
                className={`mt-1 text-sm ${
                  completed ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <PriorityBadge priority={priority} />
              {formattedDate && (
                <span className="text-xs text-gray-500">
                  Due: {formattedDate}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
          aria-label="Delete todo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default TodoItem;