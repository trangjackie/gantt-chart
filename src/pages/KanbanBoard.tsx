import React, { useState } from 'react';
import { Card, Col, Row, Tag, Divider } from 'antd';
import dayjs from 'dayjs';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task } from '../types';
import '../KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', subject: 'Project Kickoff', type: 'milestone', status: 'Done', startDate: dayjs('2025-03-01'), finishDate: dayjs('2025-03-01') },
    { id: '2', subject: 'Requirement Gathering', type: 'project', status: 'In Progress', startDate: dayjs('2025-03-02'), finishDate: dayjs('2025-03-10'), expanded: false, children: [
      { id: '2-1', subject: 'Stakeholder Interviews', type: 'task', status: 'Done', startDate: dayjs('2025-03-02'), finishDate: dayjs('2025-03-04'), parentId: '2' },
      { id: '2-2', subject: 'Draft Specs', type: 'task', status: 'In Progress', startDate: dayjs('2025-03-05'), finishDate: dayjs('2025-03-08'), parentId: '2' },
    ]},
    { id: '3', subject: 'UI Design', type: 'task', status: 'Open', startDate: dayjs('2025-03-11'), finishDate: dayjs('2025-03-15') },
    { id: '4', subject: 'Backend Development', type: 'project', status: 'Open', startDate: dayjs('2025-03-16') },
    { id: '5', subject: 'Database Setup', type: 'task', status: 'Done', startDate: dayjs('2025-03-17'), finishDate: dayjs('2025-03-18') },
  ]);

  const statuses: ("Open" | "In Progress" | "Done")[] = ['Open', 'In Progress', 'Done'];

  const getTasksByStatus = (status: "Open" | "In Progress" | "Done") => {
    // Thay đổi cách lấy task theo status
    const result: Task[] = [];
    
    const findTasks = (taskList: Task[]) => {
      taskList.forEach(task => {
        if (task.status === status) {
          result.push(task);
        }
        if (task.children) {
          findTasks(task.children);
        }
      });
    };
    
    findTasks(tasks);
    return result;
  };

  const updateTaskStatus = (taskId: string, newStatus: "Open" | "In Progress" | "Done") => {
    const updateTasksRecursively = (taskList: Task[]): Task[] => {
      return taskList.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        if (task.children) {
          return { ...task, children: updateTasksRecursively(task.children) };
        }
        return task;
      });
    };
    setTasks(updateTasksRecursively(tasks));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    const draggedTaskId = result.draggableId;
    const newStatus = destination.droppableId as "Open" | "In Progress" | "Done";
    updateTaskStatus(draggedTaskId, newStatus);
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'task': return '#e6f7ff';
      case 'milestone': return '#f6ffed';
      case 'project': return '#fff7e6';
      default: return '#fff';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'task': return '#1890ff';
      case 'milestone': return '#52c41a';
      case 'project': return '#fa8c16';
      default: return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#1890ff';
      case 'In Progress': return '#fa8c16';
      case 'Done': return '#52c41a';
      default: return '#555';
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ padding: '32px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#1d3557', fontSize: '28px', fontWeight: '600' }}>
          Kanban Board
        </h1>
        <Row gutter={[24, 24]}>
          {statuses.map(status => (
            <Col span={8} key={status}>
              <Card
                title={
                  <span style={{ fontSize: '20px', fontWeight: '600', color: getStatusColor(status) }}>
                    {status} ({getTasksByStatus(status).length})
                  </span>
                }
                headStyle={{
                  background: '#fff',
                  borderBottom: `3px solid ${getStatusColor(status)}`,
                  padding: '16px',
                }}
                bodyStyle={{ background: '#fff', minHeight: '400px', padding: '20px' }}
                style={{ borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden' }}
              >
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: '100px' }}
                    >
                      {getTasksByStatus(status).length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>No tasks yet</p>
                      ) : (
                        getTasksByStatus(status).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  marginBottom: '16px',
                                  ...provided.draggableProps.style
                                }}
                              >
                                <Card
                                  {...provided.dragHandleProps}
                                  style={{
                                    background: getTaskColor(task.type),
                                    borderLeft: `4px solid ${getBorderColor(task.type)}`,
                                    borderRadius: '8px',
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                  }}
                                  className="draggable-card"
                                  hoverable
                                >
                                  <p style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#2d3436' }}>
                                    {task.subject}
                                  </p>
                                  <p>
                                    <Tag
                                      color={getBorderColor(task.type)}
                                      style={{ borderRadius: '12px', padding: '0 8px', fontWeight: '500' }}
                                    >
                                      {task.type.toUpperCase()}
                                    </Tag>
                                  </p>
                                  <Divider style={{ margin: '8px 0' }} />
                                  <p style={{ color: '#636e72', fontSize: '13px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '500' }}>Start:</span> {task.startDate.format('MMM DD, YYYY')}
                                  </p>
                                  <p style={{ color: '#636e72', fontSize: '13px' }}>
                                    <span style={{ fontWeight: '500' }}>End:</span> {task.finishDate ? task.finishDate.format('MMM DD, YYYY') : '-'}
                                  </p>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;