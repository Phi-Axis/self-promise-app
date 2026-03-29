import { useState } from 'react';
import { usePromises } from './hooks/usePromises';
import { Home } from './pages/Home';
import { AddPromise } from './pages/AddPromise';
import './App.css';

type Page = 'home' | 'add';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { state, addPromise, completePromise, deletePromise } = usePromises();

  const handleAddPromise = (title: string, description?: string, dueDate?: string) => {
    addPromise(title, description, dueDate);
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' ? (
        <Home
          todayPromise={state.todayPromise}
          allPromises={state.promises}
          onAddClick={() => setCurrentPage('add')}
          onCompleteClick={completePromise}
          onDeleteClick={deletePromise}
        />
      ) : (
        <AddPromise
          onAdd={handleAddPromise}
          onCancel={() => setCurrentPage('home')}
        />
      )}
    </>
  );
}

export default App;
