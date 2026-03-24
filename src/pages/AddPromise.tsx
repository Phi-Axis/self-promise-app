import { useState } from 'react';
import { getTodayDate } from '../utils/storage';

interface AddPromiseProps {
  onAdd: (title: string, description?: string, dueDate?: string) => void;
  onCancel: () => void;
}

export const AddPromise = ({ onAdd, onCancel }: AddPromiseProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDate());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description, dueDate);
      setTitle('');
      setDescription('');
      setDueDate(getTodayDate());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-light text-warm-900 mb-8">新しい約束</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm text-warm-600 mb-2">約束</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="何をしたいですか？"
              className="w-full px-4 py-3 bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-warm-400 text-warm-900 placeholder-warm-400"
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm text-warm-600 mb-2">詳細（任意）</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="詳しく説明してください"
              rows={4}
              className="w-full px-4 py-3 bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-warm-400 text-warm-900 placeholder-warm-400 resize-none"
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm text-warm-600 mb-2">期限</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-warm-200 rounded-lg focus:outline-none focus:border-warm-400 text-warm-900"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-warm-600 text-white rounded-lg hover:bg-warm-700 transition-colors font-light"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-warm-300 text-warm-600 rounded-lg hover:border-warm-400 hover:text-warm-700 transition-colors font-light"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
