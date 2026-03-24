import { useState } from 'react';
import { Promise } from '../types';

interface HomeProps {
  todayPromise?: Promise;
  allPromises: Promise[];
  onAddClick: () => void;
  onCompleteClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const Home = ({
  todayPromise,
  allPromises,
  onAddClick,
  onCompleteClick,
  onDeleteClick,
}: HomeProps) => {
  const [showAll, setShowAll] = useState(false);

  const completedCount = allPromises.filter(p => p.completed).length;
  const totalCount = allPromises.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-warm-900 mb-2">
            自分との約束
          </h1>
          <p className="text-warm-600 text-sm">
            {completedCount} / {totalCount} 完了
          </p>
        </div>

        {/* Today's Promise */}
        {todayPromise && (
          <div className="mb-6 p-6 bg-white border border-warm-200 rounded-lg shadow-sm">
            <h2 className="text-sm text-warm-600 mb-3">今日の約束</h2>
            <p className="text-lg text-warm-900 mb-4">{todayPromise.title}</p>
            {todayPromise.description && (
              <p className="text-warm-700 text-sm mb-4">{todayPromise.description}</p>
            )}
            <button
              onClick={() => onCompleteClick(todayPromise.id)}
              className="w-full py-2 px-4 bg-warm-600 text-white rounded hover:bg-warm-700 transition-colors text-sm"
            >
              完了
            </button>
          </div>
        )}

        {/* Add New Promise */}
        <button
          onClick={onAddClick}
          className="w-full mb-6 py-3 px-4 border-2 border-dashed border-warm-300 text-warm-600 rounded-lg hover:border-warm-400 hover:text-warm-700 transition-colors text-sm font-light"
        >
          + 新しい約束を追加
        </button>

        {/* All Promises */}
        {allPromises.length > 0 && (
          <div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-warm-600 text-sm mb-4 hover:text-warm-700"
            >
              {showAll ? '▼' : '▶'} すべての約束 ({allPromises.length})
            </button>

            {showAll && (
              <div className="space-y-2">
                {allPromises.map(promise => (
                  <div
                    key={promise.id}
                    className={`p-4 bg-white border border-warm-200 rounded-lg flex items-start justify-between ${
                      promise.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          promise.completed
                            ? 'line-through text-warm-500'
                            : 'text-warm-900'
                        }`}
                      >
                        {promise.title}
                      </p>
                      <p className="text-xs text-warm-500 mt-1">
                        {new Date(promise.dueDate).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!promise.completed && (
                        <button
                          onClick={() => onCompleteClick(promise.id)}
                          className="text-warm-600 hover:text-warm-700 text-xs"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteClick(promise.id)}
                        className="text-warm-400 hover:text-warm-500 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
