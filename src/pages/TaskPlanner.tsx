import React, { useState } from 'react';
import { Layout, Menu, Card, Button, Modal, Form, Input, Select, Switch, List, notification } from 'antd';
import { PlusOutlined, ProjectOutlined } from '@ant-design/icons';
import './TaskPlanner.css';

const { Sider, Content } = Layout;
const { Option } = Select;

// Định nghĩa kiểu dữ liệu
interface Task {
  id: string;
  name: string;
  assignee: string;
  status: string;
  dependencies?: string[]; // ID của các nhiệm vụ phụ thuộc
  autoTrigger?: string; // ID của nhiệm vụ sẽ tự động mở
}

const TaskPlanner: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Phân tích nghiệp vụ', assignee: 'Minh', status: 'Todo', autoTrigger: '2' },
    { id: '2', name: 'Thiết kế UI', assignee: 'Lan', status: 'Todo', dependencies: ['1'] },
  ]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Danh sách dự án mẫu
  const projects = ['Ứng dụng đặt đồ ăn', 'Chiến dịch marketing'];

  // Xử lý khi hoàn thành nhiệm vụ
  const handleTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: 'Done' };
        // Tự động kích hoạt nhiệm vụ tiếp theo nếu có
        if (task.autoTrigger) {
          const nextTask = tasks.find((t) => t.id === task.autoTrigger);
          if (nextTask && nextTask.status === 'Todo') {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === nextTask.id ? { ...t, status: 'InProgress' } : t
              )
            );
            notification.success({
              message: `Nhiệm vụ "${nextTask.name}" đã được kích hoạt!`,
            });
          }
        }
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Mở modal thêm/sửa nhiệm vụ
  const showModal = (task?: Task) => {
    setSelectedTask(task || null);
    if (task) form.setFieldsValue(task);
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleOk = () => {
    form.validateFields().then((values) => {
      const newTask: Task = {
        id: selectedTask?.id || Date.now().toString(),
        ...values,
        status: selectedTask?.status || 'Todo',
      };
      setTasks((prev) =>
        selectedTask
          ? prev.map((t) => (t.id === selectedTask.id ? newTask : t))
          : [...prev, newTask]
      );
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider width={200} className="sidebar">
        <Menu mode="vertical" theme="dark" defaultSelectedKeys={['1']}>
          {projects.map((project, index) => (
            <Menu.Item key={index + 1} icon={<ProjectOutlined />}>
              {project}
            </Menu.Item>
          ))}
        </Menu>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          style={{ margin: '16px' }}
        >
          Tạo nhiệm vụ
        </Button>
      </Sider>

      {/* Main View */}
      <Layout>
        <Content style={{ padding: '24px' }}>
          <div className="kanban-board">
            {['Todo', 'InProgress', 'Done'].map((status) => (
              <div key={status} className="kanban-column">
                <h3>{status === 'Todo' ? 'Chưa bắt đầu' : status === 'InProgress' ? 'Đang thực hiện' : 'Hoàn thành'}</h3>
                <List
                  dataSource={tasks.filter((t) => t.status === status)}
                  renderItem={(task) => (
                    <Card
                      size="small"
                      title={task.name}
                      extra={
                        task.status !== 'Done' && (
                          <Button
                            type="link"
                            onClick={() => handleTaskComplete(task.id)}
                          >
                            Hoàn thành
                          </Button>
                        )
                      }
                      style={{ marginBottom: '8px', cursor: 'pointer' }}
                      onClick={() => showModal(task)}
                    >
                      <p>Người phụ trách: {task.assignee}</p>
                      {task.dependencies && (
                        <p>Phụ thuộc: {tasks.find(t => t.id === task.dependencies![0])?.name}</p>
                      )}
                      {task.autoTrigger && (
                        <p>Kích hoạt: {tasks.find(t => t.id === task.autoTrigger)?.name}</p>
                      )}
                    </Card>
                  )}
                />
              </div>
            ))}
          </div>
        </Content>
      </Layout>

      {/* Modal thêm/sửa nhiệm vụ */}
      <Modal
        title={selectedTask ? 'Sửa nhiệm vụ' : 'Tạo nhiệm vụ mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên nhiệm vụ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="assignee" label="Người phụ trách" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dependencies" label="Phụ thuộc vào">
            <Select mode="multiple">
              {tasks.map((task) => (
                <Option key={task.id} value={task.id}>
                  {task.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="autoTrigger" label="Kích hoạt nhiệm vụ">
            <Select>
              {tasks.map((task) => (
                <Option key={task.id} value={task.id}>
                  {task.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="Todo">
            <Select>
              <Option value="Todo">Chưa bắt đầu</Option>
              <Option value="InProgress">Đang thực hiện</Option>
              <Option value="Done">Hoàn thành</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default TaskPlanner;