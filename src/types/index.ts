import { Dayjs } from 'dayjs';

export interface Task {
  id: string;
  subject: string;
  type: 'task' | 'milestone' | 'project';
  status: 'Open' | 'In Progress' | 'Done';
  startDate: Dayjs; // Bắt buộc
  finishDate?: Dayjs; // Không bắt buộc
  children?: Task[];
  parentId?: string;
  expanded?: boolean;
  assignee?: string;
}

export type TaskCalendarProps = {
  initialDate?: Dayjs;
};

export interface ColumnConfig {
  key: keyof Task | 'duration';
  label: string;
  visible: boolean;
}

export interface FilterConfig {
  type?: Task['type'];
  status?: Task['status'];
}

export interface SortConfig {
  key: keyof Task | 'duration';
  direction: 'asc' | 'desc';
}