import React from 'react';
import KanbanBoard from './pages/KanbanBoard';
import TaskCalendar from './pages/TaskCalendar';

const App: React.FC = () => {
  return (
    <div className="app">
      <TaskCalendar />
    </div>
  );
};

export default App;