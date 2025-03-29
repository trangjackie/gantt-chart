import React from 'react';
import KanbanBoard from './pages/KanbanBoard';
import TaskCalendar from './pages/TaskCalendar';
import StatusFlowBuilder from './pages/StatusFlowBuilder';
import TaskPlanner from './pages/TaskPlanner';
import GanttChart from './pages/GanttChart';

const App: React.FC = () => {
  return (
    <div className="app">
      <GanttChart />
    </div>
  );
};

export default App;