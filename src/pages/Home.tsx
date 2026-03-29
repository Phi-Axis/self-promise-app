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
  <div className="min-h-screen p-6 bg-blue-100">
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-warm-900 mb-2">
          自分との約束
        </h1>
        <p className="text-sm text-gray-600">
          {completedCount} / {totalCount} 完了
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="w-full mb-6 py-3 px-4 bg-blue-600 text-white rounded"
      >
        ＋ 新しい約束を追加
      </button>
    </div>
  </div>
);
    
};
