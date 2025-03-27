import React, { useState } from 'react';
import { Card, Tag, Divider, Button, Switch } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { Task, TaskCalendarProps } from '../types';

dayjs.locale('vi');

const TaskCalendar: React.FC<TaskCalendarProps> = ({ initialDate = dayjs() }) => {
    const sampleTasks: Task[] = [
        {
          id: '1',
          subject: 'Thiết kế UI/UX',
          type: 'task',
          status: 'In Progress',
          startDate: dayjs().startOf('week').add(1, 'day'),
          finishDate: dayjs().startOf('week').add(9, 'day'),
          assignee: 'Nguyễn Văn A',
        },
        {
          id: '2',
          subject: 'Phát triển API Core',
          type: 'task',
          status: 'Open',
          startDate: dayjs().startOf('week').add(2, 'day'),
          finishDate: dayjs().startOf('week').add(4, 'day'),
          assignee: 'Trần Thị B',
        },
        {
          id: '3',
          subject: 'Kiểm thử tích hợp',
          type: 'task',
          status: 'Open',
          startDate: dayjs().startOf('week').add(3, 'day'),
          finishDate: dayjs().startOf('week').add(5, 'day'),
          // Task không có assignee
        },
        {
          id: '4',
          subject: 'Triển khai production',
          type: 'milestone',
          status: 'Open',
          startDate: dayjs().startOf('week').add(5, 'day'),
          finishDate: dayjs().startOf('week').add(5, 'day'),
          assignee: 'Trần Thị B',
        },
        {
          id: '5',
          subject: 'Nghiên cứu công nghệ mới',
          type: 'project',
          status: 'In Progress',
          startDate: dayjs().startOf('week'),
          finishDate: dayjs().startOf('week').add(6, 'day'),
          // Task không có assignee
        },
        {
            id: '6',
            subject: 'Phát triển API Core 2',
            type: 'task',
            status: 'Open',
            startDate: dayjs().startOf('week').add(3, 'day'),
            finishDate: dayjs().startOf('week').add(14, 'day'),
            assignee: 'Trần Thị B',
          },
          {
            id: '7',
            subject: 'Thiết kế tổng thể',
            type: 'task',
            status: 'Open',
            startDate: dayjs().startOf('week').add(3, 'day'),
            finishDate: dayjs().startOf('week').add(14, 'day'),
            assignee: 'Trangdld',
          },
          {
            id: '8',
            subject: 'Thảo luận',
            type: 'task',
            status: 'Open',
            startDate: dayjs().startOf('week').add(5, 'day'),
            finishDate: dayjs().startOf('week').add(12, 'day'),
            assignee: 'Trangdld',
          },
      ];

      const [currentDate, setCurrentDate] = useState(dayjs());
      const [showDetails, setShowDetails] = useState(true); // State cho switch
  // Lấy danh sách ngày trong tuần
  const getWeekDays = () => {
    const days: Dayjs[] = [];
    const startOfWeek = currentDate.startOf('week');
    
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }
    return days;
  };

  // Kiểm tra task có nằm trong tuần hiện tại không
  const isTaskInWeek = (task: Task) => {
    const weekStart = currentDate.startOf('week');
    const weekEnd = currentDate.endOf('week');
    const taskStart = dayjs(task.startDate);
    const taskEnd = dayjs(task.finishDate);

    return (
      (taskStart.isBefore(weekEnd) && taskEnd.isAfter(weekStart)) ||
      taskStart.isSame(weekStart, 'day') ||
      taskStart.isSame(weekEnd, 'day') ||
      taskEnd.isSame(weekStart, 'day') ||
      taskEnd.isSame(weekEnd, 'day')
    );
  };

  // Tính toán phần task hiển thị trong tuần này
  const getTaskDisplayInfo = (task: Task) => {
    const weekStart = currentDate.startOf('week');
    const weekEnd = currentDate.endOf('week');
    const taskStart = dayjs(task.startDate);
    const taskEnd = dayjs(task.finishDate);
    
    const displayStart = taskStart.isBefore(weekStart) ? weekStart : taskStart;
    const displayEnd = taskEnd.isAfter(weekEnd) ? weekEnd : taskEnd;
    
    const span = displayEnd.diff(displayStart, 'day') + 1;
    const startIndex = displayStart.diff(weekStart, 'day');
    
    return { span, startIndex, displayStart, displayEnd };
  };

  // Nhóm và sắp xếp task theo assignee (Unassigned xuống cuối)
  const groupAndSortTasksByAssignee = (tasks: Task[]) => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      const assignee = task.assignee || 'Unassigned';
      if (!grouped[assignee]) {
        grouped[assignee] = [];
      }
      grouped[assignee].push(task);
    });

    return Object.entries(grouped).sort(([a], [b]) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    });
  };

  // Tính toán và phân bổ task vào các dòng
  const calculateTaskLayout = (tasks: Task[]) => {
    const days = Array(7).fill(null).map(() => [] as Task[]);
    const rows: {task: Task; row: number; col: number; span: number}[] = [];
    
    // Sắp xếp tasks theo thời gian bắt đầu
    const sortedTasks = [...tasks].sort((a, b) => 
      dayjs(a.startDate).diff(dayjs(b.startDate))
    );

    sortedTasks.forEach(task => {
      const { startIndex, span } = getTaskDisplayInfo(task);
      let row = 0;
      
      // Tìm dòng trống để đặt task
      while (true) {
        let canPlace = true;
        for (let i = startIndex; i < startIndex + span; i++) {
          if (i >= 7 || days[i][row]) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          // Đánh dấu các ô đã được sử dụng
          for (let i = startIndex; i < startIndex + span; i++) {
            if (i < 7) days[i][row] = task;
          }
          rows.push({
            task,
            row,
            col: startIndex,
            span: Math.min(span, 7 - startIndex)
          });
          break;
        }
        row++;
      }
    });

    return {
      rows: days.reduce((max, day) => Math.max(max, day.length), 0) + 1,
      tasks: rows
    };
  };

  // Chuyển tuần
  const goToPreviousWeek = () => setCurrentDate(currentDate.subtract(1, 'week'));
  const goToNextWeek = () => setCurrentDate(currentDate.add(1, 'week'));

  // Lấy màu sắc theo loại task
  const getTaskColor = (type: string) => {
    switch (type) {
      case 'task': return '#1890ff';
      case 'milestone': return '#52c41a';
      case 'project': return '#fa8c16';
      default: return '#d9d9d9';
    }
  };

  // Lấy màu nền theo trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#f6ffed';
      case 'In Progress': return '#e6f7ff';
      case 'Open': return '#fff1f0';
      case 'Not Started': return '#f5f5f5';
      default: return '#fff';
    }
  };

  const weekDays = getWeekDays();
  const visibleTasks = sampleTasks.filter(task => isTaskInWeek(task));
  const sortedAssigneeTasks = groupAndSortTasksByAssignee(visibleTasks);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <div>
          <Button onClick={goToPreviousWeek}>Tuần trước</Button>
          <Button onClick={goToNextWeek} style={{ marginLeft: 8 }}>Tuần sau</Button>
        </div>
        <h2 style={{ margin: 0 }}>{currentDate.format('MMMM YYYY')}</h2>
        <div>
          <span style={{ marginRight: 8 }}>Chi tiết:</span>
          <Switch 
            checked={showDetails}
            onChange={checked => setShowDetails(checked)}
          />
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateRows: 'auto', // Header + các dòng task
        gap: '8px'
      }}>
        {/* Header - cố định 1 dòng */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px repeat(7, 1fr)',
          gap: '8px',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 2,
          paddingBottom: '8px'
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            padding: '10px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            Người phụ trách
          </div>
          
          {weekDays.map(day => (
            <div key={day.format('DD-MM')} style={{ 
              fontWeight: 'bold', 
              padding: '10px',
              borderBottom: '2px solid #f0f0f0',
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ color: '#1d39c4' }}>{day.format('dddd')}</div>
              <div style={{ fontSize: '16px' }}>{day.format('DD/MM')}</div>
            </div>
          ))}
        </div>

        {/* Nội dung - mỗi assignee là một khối */}
        {sortedAssigneeTasks.map(([assignee, tasks]) => {
          const { rows, tasks: layoutTasks } = calculateTaskLayout(tasks);
          
          return (
            <div 
              key={assignee}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px repeat(7, 1fr)',
                gridTemplateRows: `repeat(${rows}, ${showDetails ? 'auto' : '35px'})`,
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              {/* Tên assignee - chiếm toàn bộ chiều cao */}
              <div style={{ 
                gridRow: `1 / span ${rows}`,
                padding: '10px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: assignee === 'Unassigned' ? '#f5f5f5' : '#fafafa',
                position: 'sticky',
                left: 0,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  fontWeight: 'bold',
                  color: assignee === 'Unassigned' ? '#8c8c8c' : '#1d39c4'
                }}>
                  {assignee}
                </div>
                {showDetails && (
                <Tag 
                  style={{ 
                    marginTop: '8px',
                    backgroundColor: assignee === 'Unassigned' ? '#f5f5f5' : '#e6f7ff',
                    alignSelf: 'flex-start'
                  }}
                >
                  {tasks.length} task
                </Tag>)}
              </div>

              {/* Render các task đã được phân bổ */}
              {layoutTasks.map(({ task, row, col, span }) => (
                <div
                  key={`${task.id}-${col}`}
                  style={{
                    gridColumn: `${col + 2} / span ${span}`,
                    gridRow: row + 1,
                    padding: '4px',
                    height: '100%'
                  }}
                >
                  <Card
                  size="small"
                  bodyStyle={{ 
                    padding: showDetails ? '12px' : '4px',
                    overflow: 'hidden'
                  }}
                  style={{
                    backgroundColor: getStatusColor(task.status),
                    borderLeft: `3px solid ${getTaskColor(task.type)}`,
                    height: '100%',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: showDetails ? 'space-between' : 'center'
                  }}
                >
                  <div style={{ 
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {task.subject}
                  </div>
                  
                  {showDetails ? (
                    <>
                      <Tag color={getTaskColor(task.type)} style={{ marginTop: 4 }}>
                        {task.type}
                      </Tag>
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ fontSize: '12px' }}>
                        {dayjs(task.startDate).format('DD/MM HH:mm')} - {dayjs(task.finishDate).format('DD/MM HH:mm')}
                      </div>
                      <Tag 
                        color={
                          task.status === 'Done' ? 'green' : 
                          task.status === 'In Progress' ? 'orange' : 'default'
                        }
                        style={{ marginTop: 4 }}
                      >
                        {task.status}
                      </Tag>
                    </>
                  ) : (
                    <Tag 
                      color={getTaskColor(task.type)}
                      style={{ 
                        marginTop: 2,
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {task.type}
                    </Tag>
                  )}
                </Card>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCalendar;