import React, { useState, useRef } from 'react';
import { Button, Modal, Input, DatePicker, Select, Pagination } from 'antd';
import { Gantt, Task as GanttTask, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import dayjs, { Dayjs } from 'dayjs';
import TaskTable from '../components/TaskTable';
import { Task, ColumnConfig, FilterConfig, SortConfig } from '../types';
import '../GanttChart.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const GanttChart: React.FC = () => {
    // Các task cần expanded false khi khởi tạo để tránh lỗi hiển thị bảng
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', subject: 'Project Kickoff', type: 'milestone', status: 'Done', startDate: dayjs('2025-03-01'), finishDate: dayjs('2025-03-01') },
        { id: '2', subject: 'Requirement Gathering', type: 'project', status: 'In Progress', startDate: dayjs('2025-03-02'), finishDate: dayjs('2025-03-10'), expanded: false, children: [
          { id: '2-1', subject: 'Stakeholder Interviews', type: 'task', status: 'Done', startDate: dayjs('2025-03-02'), finishDate: dayjs('2025-03-04'), parentId: '2' },
          { id: '2-2', subject: 'Draft Specs', type: 'task', status: 'In Progress', startDate: dayjs('2025-03-05'), finishDate: dayjs('2025-03-08'), parentId: '2' },
          { id: '2-3', subject: 'Draft Specs 3', type: 'task', status: 'In Progress', startDate: dayjs('2025-03-05'), finishDate: dayjs('2025-03-08'), parentId: '2' },
        ]},
        { id: '3', subject: 'UI Design', type: 'task', status: 'Open', startDate: dayjs('2025-03-11'), finishDate: dayjs('2025-03-15') },
        { id: '4', subject: 'Backend Development', type: 'project', status: 'Open', startDate: dayjs('2025-03-16') },
        { id: '5', subject: 'Database Setup', type: 'task', status: 'Done', startDate: dayjs('2025-03-17'), finishDate: dayjs('2025-03-18') },
        { id: '6', subject: 'API Integration', type: 'task', status: 'In Progress', startDate: dayjs('2025-03-19'), finishDate: dayjs('2025-03-25') },
        { id: '7', subject: 'Team Review Meeting', type: 'milestone', status: 'Open', startDate: dayjs('2025-03-26'), finishDate: dayjs('2025-03-26') },
        { id: '8', subject: 'Frontend Development', type: 'project', status: 'Open', startDate: dayjs('2025-03-27'), finishDate: dayjs('2025-04-10'), expanded: false, children: [
          { id: '8-1', subject: 'Component Design', type: 'task', status: 'Open', startDate: dayjs('2025-03-27'), finishDate: dayjs('2025-04-02'), parentId: '8' },
          { id: '8-2', subject: 'State Management', type: 'task', status: 'Open', startDate: dayjs('2025-04-03'), parentId: '8' },
        ]},
        { id: '9', subject: 'Testing Phase 1', type: 'task', status: 'Open', startDate: dayjs('2025-04-11') },
        { id: '10', subject: 'Bug Fixing', type: 'task', status: 'Open', startDate: dayjs('2025-04-12'), finishDate: dayjs('2025-04-15') },
        { id: '11', subject: 'Code Review', type: 'milestone', status: 'Open', startDate: dayjs('2025-04-16'), finishDate: dayjs('2025-04-16') },
        { id: '12', subject: 'Deployment Prep', type: 'task', status: 'Open', startDate: dayjs('2025-04-17'), finishDate: dayjs('2025-04-20') },
        { id: '13', subject: 'User Training', type: 'task', status: 'Open', startDate: dayjs('2025-04-21') },
        { id: '14', subject: 'Release v1.0', type: 'milestone', status: 'Open', startDate: dayjs('2025-04-25'), finishDate: dayjs('2025-04-25') },
        { id: '15', subject: 'Post-Release Support', type: 'project', status: 'Open', startDate: dayjs('2025-04-26'), finishDate: dayjs('2025-05-05') },
        { id: '16', subject: 'Feature Enhancement', type: 'task', status: 'Open', startDate: dayjs('2025-05-06'), finishDate: dayjs('2025-05-12') },
        { id: '17', subject: 'Performance Testing', type: 'task', status: 'Open', startDate: dayjs('2025-05-13') },
        { id: '18', subject: 'Security Audit', type: 'task', status: 'Done', startDate: dayjs('2025-05-14'), finishDate: dayjs('2025-05-16') },
        { id: '19', subject: 'Final Review', type: 'milestone', status: 'Open', startDate: dayjs('2025-05-20'), finishDate: dayjs('2025-05-20') },
        { id: '20', subject: 'Project Wrap-Up', type: 'project', status: 'Open', startDate: dayjs('2025-05-21'), finishDate: dayjs('2025-06-01'), expanded: false, children: [
          { id: '20-1', subject: 'Documentation', type: 'task', status: 'Open', startDate: dayjs('2025-05-21'), finishDate: dayjs('2025-05-25'), parentId: '20' },
          { id: '20-2', subject: 'Lessons Learned', type: 'task', status: 'Open', startDate: dayjs('2025-05-26'), parentId: '20' },
        ]},
      ]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'id', label: 'ID', visible: true },
    { key: 'subject', label: 'Subject', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'startDate', label: 'Start Date', visible: true },
    { key: 'finishDate', label: 'Finish Date', visible: true },
    { key: 'duration', label: 'Duration', visible: true },
  ]);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [sort, setSort] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const [tableWidth, setTableWidth] = useState(900); // Độ rộng bảng ban đầu
  const [pageSize, setPageSize] = useState(10);
  const resizerRef = useRef<HTMLDivElement>(null);

  const handleCreateTask = () => {
    if (newTask.subject && newTask.startDate) {
      const task: Task = {
        id: `${Date.now()}`,
        subject: newTask.subject,
        type: newTask.type || 'task',
        status: newTask.status || 'Open',
        startDate: newTask.startDate,
        finishDate: newTask.finishDate,
        children: [],
        expanded: false,
      };
      setTasks([...tasks, task]);
      setNewTask({});
      setIsCreateModalVisible(false);
    }
  };

  const handleTaskChange = (task: GanttTask) => {
    const updateTask = (taskList: Task[]): Task[] =>
      taskList.map(t => {
        if (t.id === task.id) {
          let newStartDate = dayjs(task.start);
          let newFinishDate = dayjs(task.end);

          // Tìm task cha nếu có parentId
          if (t.parentId) {
            const parentTask = tasks.find(p => p.id === t.parentId);
            if (parentTask && newStartDate.isBefore(parentTask.startDate)) {
              newStartDate = parentTask.startDate; // Giữ startDate không nhỏ hơn startDate của task cha
            }
          }

          // Đảm bảo finishDate không nhỏ hơn startDate
          if (newFinishDate.isBefore(newStartDate)) {
            newFinishDate = newStartDate; // Cập nhật finishDate nếu nhỏ hơn startDate
          }

          return { ...t, startDate: newStartDate, finishDate: newFinishDate };
        }

        if (t.children) return { ...t, children: updateTask(t.children) };
        return t;
      });

    setTasks(updateTask(tasks));
};


  const handleExpand = (taskId: string, expanded: boolean) => {
    const updateTask = (taskList: Task[]): Task[] =>
      taskList.map(task => {
        if (task.id === taskId) return { ...task, expanded };
        //if (task.children) return { ...task, children: updateTask(task.children) };
        return task;
      });
    setTasks(updateTask(tasks));

  };

const flattenTasks = (taskList: Task[]): Task[] => {
    let result: Task[] = [];
    taskList.forEach(task => {
        result.push(task);
        if (task.children) {
            if (task.expanded) {
                result = result.concat(flattenTasks(task.children));
            } 
        }
    });
    return result;
};


const filteredTasks = flattenTasks(tasks)
.filter(task => 
  (!filters.type || task.type === filters.type) &&
  (!filters.status || task.status === filters.status)
)
.sort((a, b) => {
  const key = sort.key;
  const direction = sort.direction === 'asc' ? 1 : -1;

  // Nếu key là 'id', so sánh id như là số
  if (key === 'id') {
    const aId = parseInt(a[key], 10);
    const bId = parseInt(b[key], 10);
    return (aId - bId) * direction;
  }

  // Sắp xếp theo duration
  if (key === 'duration') {
    const aDuration = a.finishDate ? a.finishDate.diff(a.startDate, 'day') : 0;
    const bDuration = b.finishDate ? b.finishDate.diff(b.startDate, 'day') : 0;
    return (aDuration - bDuration) * direction;
  }

  // Sắp xếp theo startDate hoặc finishDate
  if (key === 'startDate' || key === 'finishDate') {
    return ((a[key]?.unix() || 0) - (b[key]?.unix() || 0)) * direction;
  }

  return String(a[key]).localeCompare(String(b[key])) * direction;
});

    

    const paginatedTasks = filteredTasks.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize);
    

  const ganttTasks: GanttTask[] = paginatedTasks.map(task => ({
    start: task.startDate.toDate(),
    end: task.finishDate ? task.finishDate.toDate() : task.startDate.toDate(),
    name: task.subject,
    id: task.id,
    type: task.type,
    progress: task.status === 'Done' ? 100 : task.status === 'In Progress' ? 50 : 0,
    isDisabled: false,
    styles: {
      backgroundColor: task.type === 'task' ? '#1890ff' : task.type === 'milestone' ? '#52c41a' : '#fa8c16',
      backgroundSelectedColor: task.type === 'task' ? '#40a9ff' : task.type === 'milestone' ? '#73d13d' : '#ffbb96',
      progressColor: '#ffbb54',
      progressSelectedColor: '#ff9e0d',
    },
  }));

  
  const handleResize = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = tableWidth;
    const totalWidth = window.innerWidth; // Tổng chiều rộng màn hình

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newTableWidth = startWidth + (moveEvent.clientX - startX);
      // Giới hạn tableWidth từ 300px đến 70% tổng chiều rộng màn hình
      const boundedWidth = Math.max(300, Math.min(newTableWidth, totalWidth * 0.7));
      setTableWidth(boundedWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginRight: '8px' }}>
          + New Task
        </Button>
        <Button onClick={() => setIsConfigModalVisible(true)} style={{ marginRight: '8px' }}>
          Configuration
        </Button>
        <Select
          value={viewMode}
          onChange={value => setViewMode(value)}
          style={{ width: '120px' }}
        >
          <Option value={ViewMode.Day}>Day</Option>
          <Option value={ViewMode.Week}>Week</Option>
          <Option value={ViewMode.Month}>Month</Option>
        </Select>
      </div>
      <div className="gantt-content" style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: `${tableWidth}px`, background: '#fff', borderRight: '1px solid #e8e8e8', flexShrink: 0 }}>
          <TaskTable tasks={paginatedTasks} columns={columns} onExpand={handleExpand} />
        </div>
        <div ref={resizerRef} className="resizer" onMouseDown={handleResize} style={{ width: '5px', cursor: 'col-resize' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Gantt
            tasks={ganttTasks}
            viewMode={viewMode}
            onDateChange={handleTaskChange}
            columnWidth={viewMode === ViewMode.Day ? 65 : viewMode === ViewMode.Week ? 250 : 300}
            listCellWidth=""
            rowHeight={35}
          />
        </div>
      </div>
      <div className="gantt-footer">
  <Pagination
    current={currentPage}
    pageSize={pageSize}
    total={filteredTasks.length}
    onChange={(page, newPageSize) => {
      setCurrentPage(page);
      setPageSize(newPageSize); // Cập nhật pageSize khi người dùng thay đổi
    }}
    showSizeChanger // Hiển thị tùy chọn thay đổi pageSize
    pageSizeOptions={['10', '20', '50']} // Các tùy chọn pageSize
    style={{ textAlign: 'center' }}
  />
</div>

      <Modal
        title="New Task"
        open={isCreateModalVisible}
        onOk={handleCreateTask}
        onCancel={() => setIsCreateModalVisible(false)}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          placeholder="Subject"
          value={newTask.subject || ''}
          onChange={e => setNewTask({ ...newTask, subject: e.target.value })}
          style={{ marginBottom: '16px' }}
        />
        <Select
          placeholder="Type"
          value={newTask.type}
          onChange={value => setNewTask({ ...newTask, type: value })}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          <Option value="task">Task</Option>
          <Option value="milestone">Milestone</Option>
          <Option value="project">Project</Option>
        </Select>
        <Select
          placeholder="Status"
          value={newTask.status}
          onChange={value => setNewTask({ ...newTask, status: value })}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          <Option value="Open">Open</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
        </Select>
        <RangePicker
          value={[newTask.startDate, newTask.finishDate]}
          onChange={dates => setNewTask({ 
            ...newTask, 
            startDate: dates && dates[0] ? dates[0] : undefined,
            finishDate: dates && dates[1] ? dates[1] : undefined
          })}
          disabled={[false, false]}
        />
      </Modal>

      <Modal
        title="Configuration"
        open={isConfigModalVisible}
        onOk={() => setIsConfigModalVisible(false)}
        onCancel={() => setIsConfigModalVisible(false)}
        okText="Apply"
        cancelText="Cancel"
      >
        <h4>Columns</h4>
        {columns.map(col => (
          <div key={col.key}>
            <input
              type="checkbox"
              checked={col.visible}
              onChange={e => setColumns(columns.map(c => c.key === col.key ? { ...c, visible: e.target.checked } : c))}
            />
            <span style={{ marginLeft: '8px' }}>{col.label}</span>
          </div>
        ))}
        <h4 style={{ marginTop: '16px' }}>Filters</h4>
        <Select
          placeholder="Filter by Type"
          value={filters.type}
          onChange={value => setFilters({ ...filters, type: value })}
          style={{ width: '100%', marginBottom: '16px' }}
          allowClear
        >
          <Option value="task">Task</Option>
          <Option value="milestone">Milestone</Option>
          <Option value="project">Project</Option>
        </Select>
        <Select
          placeholder="Filter by Status"
          value={filters.status}
          onChange={value => setFilters({ ...filters, status: value })}
          style={{ width: '100%', marginBottom: '16px' }}
          allowClear
        >
          <Option value="Open">Open</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
        </Select>
        <h4>Sort</h4>
        <Select
          placeholder="Sort by"
          value={sort.key}
          onChange={value => setSort({ ...sort, key: value as keyof Task })}
          style={{ width: '70%', marginBottom: '16px' }}
        >
          {columns.map(col => (
            <Option key={col.key} value={col.key}>{col.label}</Option>
          ))}
        </Select>
        <Select
          value={sort.direction}
          onChange={value => setSort({ ...sort, direction: value as 'asc' | 'desc' })}
          style={{ width: '25%', marginLeft: '5%' }}
        >
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default GanttChart;