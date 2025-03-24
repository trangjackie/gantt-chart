import React from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { Task, ColumnConfig } from '../types';

interface TaskTableProps {
  tasks: Task[];
  columns: ColumnConfig[];
  onExpand: (taskId: string, expanded: boolean) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, columns, onExpand }) => {
  const visibleColumns = columns.filter(col => col.visible).map(col => ({
    title: col.label,
    dataIndex: col.key,
    key: col.key,
    render: (value: any, record: Task) => {
      if (col.key === 'duration') {
        return record.finishDate && record.startDate
          ? `${record.finishDate.diff(record.startDate, 'day') + 1} days`
          : '-';
      }
      return dayjs.isDayjs(value) ? value.format('YYYY-MM-DD') : value || '-';
    },
  }));
// Chỉ lấy các task cấp cao nhất (không có parentId)
const rootTasks = tasks.filter(task => !task.parentId);

const dataSource = rootTasks.map(task => ({
  key: task.id,
  ...task,
}));

  return (
    <Table
      dataSource={dataSource}
      columns={visibleColumns}
      pagination={false} // Tắt phân trang mặc định của Table
      rowClassName={() => 'draggable-row'}
      expandable={{
        expandedRowKeys: tasks.filter(t => t.expanded).map(t => t.id),
        onExpand: (expanded, record) => {
            console.log(dataSource)
            onExpand(record.id, expanded)},
        expandRowByClick: true,
      }}
    />
  );
};

export default TaskTable;