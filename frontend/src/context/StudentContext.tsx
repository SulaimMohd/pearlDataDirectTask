import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  studentId?: string;
  department?: string;
  course?: string;
  academicYear?: string;
  semester?: string;
}

export interface DashboardStats {
  totalEvents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
  upcomingEvents: number;
  averageMarks: number;
}

export interface AttendanceRecord {
  id: number;
  eventId: number;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  status: string;
  marksObtained?: number;
  maxMarks?: number;
  remarks?: string;
  markedAt: string;
  markedByFaculty: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  eventType: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  facultyId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgressData {
  overallAttendance: number;
  totalEvents: number;
  presentCount: number;
  lateCount: number;
  grade: string;
  subjectPerformance: Record<string, {
    totalEvents: number;
    attended: number;
    attendanceRate: number;
    averageMarks?: number;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  dueDate: string;
  status: 'borrowed' | 'overdue' | 'returned';
  fine?: number;
}

interface StudentState {
  profile: StudentProfile | null;
  dashboardStats: DashboardStats | null;
  attendance: AttendanceRecord[];
  events: Event[];
  progress: ProgressData | null;
  notifications: Notification[];
  libraryBooks: LibraryBook[];
  loading: boolean;
  error: string | null;
}

type StudentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_PROFILE'; payload: StudentProfile }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_ATTENDANCE'; payload: AttendanceRecord[] }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'SET_PROGRESS'; payload: ProgressData }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_LIBRARY_BOOKS'; payload: LibraryBook[] }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: StudentProfile };

const initialState: StudentState = {
  profile: null,
  dashboardStats: null,
  attendance: [],
  events: [],
  progress: null,
  notifications: [
    {
      id: '1',
      title: 'Assignment Due',
      message: 'Your Mathematics assignment is due tomorrow.',
      type: 'warning',
      timestamp: '2025-10-17T10:00:00Z',
      isRead: false
    },
    {
      id: '2',
      title: 'Library Book Overdue',
      message: 'Your book "Introduction to Algorithms" is overdue.',
      type: 'error',
      timestamp: '2025-10-16T15:30:00Z',
      isRead: false
    },
    {
      id: '3',
      title: 'New Event Scheduled',
      message: 'A new workshop on "Machine Learning" has been scheduled.',
      type: 'info',
      timestamp: '2025-10-16T09:15:00Z',
      isRead: true
    }
  ],
  libraryBooks: [
    {
      id: '1',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      dueDate: '2025-10-15',
      status: 'overdue',
      fine: 50
    },
    {
      id: '2',
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz',
      isbn: '978-0073523323',
      dueDate: '2025-10-25',
      status: 'borrowed',
      fine: 0
    },
    {
      id: '3',
      title: 'Computer Networks',
      author: 'Andrew S. Tanenbaum',
      isbn: '978-0132126953',
      dueDate: '2025-10-12',
      status: 'returned',
      fine: 0
    }
  ],
  loading: false,
  error: null,
};

const studentReducer = (state: StudentState, action: StudentAction): StudentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, loading: false };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload, loading: false };
    case 'SET_ATTENDANCE':
      return { ...state, attendance: action.payload, loading: false };
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload, loading: false };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, loading: false };
    case 'SET_LIBRARY_BOOKS':
      return { ...state, libraryBooks: action.payload, loading: false };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        )
      };
    case 'UPDATE_PROFILE':
      return { ...state, profile: action.payload, loading: false };
    default:
      return state;
  }
};

interface StudentContextType {
  state: StudentState;
  fetchProfile: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  fetchAttendance: (page?: number, size?: number) => Promise<void>;
  fetchEvents: (page?: number, size?: number) => Promise<void>;
  fetchProgress: () => Promise<void>;
  updateProfile: (profileData: Partial<StudentProfile>) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  clearError: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState);
  const { state: authState } = useAuth();

  const getAuthHeaders = useCallback(() => {
    if (!authState.isAuthenticated || !authState.user?.token) {
      throw new Error('User not authenticated');
    }
    return {
      headers: {
        Authorization: `Bearer ${authState.user.token}`,
      },
    };
  }, [authState.isAuthenticated, authState.user?.token]);

  const fetchProfile = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/student/profile`, getAuthHeaders());
      dispatch({ type: 'SET_PROFILE', payload: response.data.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch profile' });
    }
  }, [getAuthHeaders]);

  const fetchDashboardStats = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/student/dashboard-stats`, getAuthHeaders());
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: response.data.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch dashboard stats' });
    }
  }, [getAuthHeaders]);

  const fetchAttendance = useCallback(async (page = 0, size = 10) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/student/attendance?page=${page}&size=${size}`, getAuthHeaders());
      dispatch({ type: 'SET_ATTENDANCE', payload: response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch attendance' });
    }
  }, [getAuthHeaders]);

  const fetchEvents = useCallback(async (page = 0, size = 10) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/student/events?page=${page}&size=${size}`, getAuthHeaders());
      dispatch({ type: 'SET_EVENTS', payload: response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch events' });
    }
  }, [getAuthHeaders]);

  const fetchProgress = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/student/progress`, getAuthHeaders());
      dispatch({ type: 'SET_PROGRESS', payload: response.data.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch progress' });
    }
  }, [getAuthHeaders]);

  const updateProfile = useCallback(async (profileData: Partial<StudentProfile>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.put(`${API_BASE_URL}/student/profile`, profileData, getAuthHeaders());
      dispatch({ type: 'UPDATE_PROFILE', payload: response.data.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update profile' });
      throw error;
    }
  }, [getAuthHeaders]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: StudentContextType = {
    state,
    fetchProfile,
    fetchDashboardStats,
    fetchAttendance,
    fetchEvents,
    fetchProgress,
    updateProfile,
    markNotificationAsRead,
    clearError,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
