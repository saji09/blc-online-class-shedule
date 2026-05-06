export interface Course {
  id: string;
  name: string;
  code: string;
  duration: string;
  description: string;
}

export interface Module {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  description: string;
}

export interface Batch {
  id: string;
  name: string;
  year: string;
  status: 'Active' | 'Completed' | 'Upcoming';
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}

export interface Class {
  id: string;
  moduleId: string;
  moduleName?: string;
  batchId: string;
  batchName?: string;
  courseId: string;
  courseName?: string;
  lecturerId: string;
  lecturerName?: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  createdAt: string;
}

export interface User {
  username: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FilterOptions {
  search: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'all' | 'upcoming' | 'ongoing' | 'completed';
  courseId?: string;
  moduleId?: string;
  batchId?: string;
  lecturerId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}