import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Event {
  id?: number;
  title: string;
  description?: string;
  eventType: 'LECTURE' | 'LAB' | 'SEMINAR' | 'EXAM' | 'WORKSHOP' | 'ASSIGNMENT' | 'MEETING' | 'PRESENTATION';
  startTime: string;
  endTime: string;
  location: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  facultyId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id?: number;
  name: string;
  email: string;
  phoneNumber?: string;
  studentId: string;
  department: string;
  course: string;
  academicYear: string;
  semester: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Attendance {
  id?: number;
  studentId: number;
  eventId: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL';
  marksObtained?: number;
  maxMarks?: number;
  remarks?: string;
  markedByFacultyId?: number;
  markedAt?: string;
  updatedAt?: string;
}

export interface FacultyStats {
  totalStudents: number;
  totalEvents: number;
  upcomingEvents: number;
  attendanceRate: string;
}

export interface StudentAttendanceAnalytics {
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentIdNumber: string;
  department: string;
  course: string;
  academicYear: string;
  semester: string;
  totalEvents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
  averageMarks: number;
  lastAttendanceDate?: string;
  lastAttendanceStatus?: string;
  lastAttendanceEvent?: string;
  performanceGrade: string;
  attendanceStatus: string;
}

export interface StudentAttendanceDetail {
  attendanceId: number;
  eventId: number;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  attendanceStatus: string;
  marksObtained?: number;
  maxMarks?: number;
  remarks?: string;
  markedAt: string;
  markedByFaculty: string;
  marksPercentage?: number;
  performanceStatus: string;
}

export interface AnalyticsSummary {
  totalStudents: number;
  studentsWithAttendance: number;
  overallAttendanceRate: string;
  overallAverageMarks: string;
  attendanceStatusDistribution: {
    Excellent: number;
    Good: number;
    Average: number;
    Poor: number;
  };
}

interface FacultyState {
  events: Event[];
  students: Student[];
  attendance: Attendance[];
  stats: FacultyStats | null;
  analyticsSummary: AnalyticsSummary | null;
  studentAnalytics: StudentAttendanceAnalytics[];
  attendanceDetails: StudentAttendanceDetail[];
  loading: boolean;
  error: string | null;
}

type FacultyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: number }
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'SET_ATTENDANCE'; payload: Attendance[] }
  | { type: 'ADD_ATTENDANCE'; payload: Attendance[] }
  | { type: 'SET_STATS'; payload: FacultyStats }
  | { type: 'SET_ANALYTICS_SUMMARY'; payload: AnalyticsSummary }
  | { type: 'SET_STUDENT_ANALYTICS'; payload: StudentAttendanceAnalytics[] }
  | { type: 'SET_ATTENDANCE_DETAILS'; payload: StudentAttendanceDetail[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: FacultyState = {
  events: [],
  students: [],
  attendance: [],
  stats: null,
  analyticsSummary: null,
  studentAnalytics: [],
  attendanceDetails: [],
  loading: false,
  error: null,
};

const facultyReducer = (state: FacultyState, action: FacultyAction): FacultyState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false };
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    case 'SET_STUDENTS':
      return { ...state, students: action.payload, loading: false };
    case 'SET_ATTENDANCE':
      return { ...state, attendance: action.payload, loading: false };
    case 'ADD_ATTENDANCE':
      return { ...state, attendance: [...state.attendance, ...action.payload] };
    case 'SET_STATS':
      return { ...state, stats: action.payload, loading: false };
    case 'SET_ANALYTICS_SUMMARY':
      return { ...state, analyticsSummary: action.payload, loading: false };
    case 'SET_STUDENT_ANALYTICS':
      return { ...state, studentAnalytics: action.payload, loading: false };
    case 'SET_ATTENDANCE_DETAILS':
      return { ...state, attendanceDetails: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface FacultyContextType {
  state: FacultyState;
  fetchEvents: () => Promise<void>;
  createEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: number, event: Omit<Event, 'id'>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchAttendanceByEvent: (eventId: number) => Promise<void>;
  markAttendance: (eventId: number, attendanceRecords: any[]) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchAnalyticsSummary: () => Promise<void>;
  fetchStudentAnalytics: (page?: number, size?: number, sortBy?: string, sortDir?: string, searchTerm?: string) => Promise<void>;
  fetchStudentAttendanceDetails: (studentId: number, page?: number, size?: number, sortBy?: string, sortDir?: string) => Promise<void>;
  clearError: () => void;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(facultyReducer, initialState);
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

  const fetchEvents = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/faculty/events`, getAuthHeaders());
      dispatch({ type: 'SET_EVENTS', payload: response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch events' });
    }
  }, [getAuthHeaders]);

  const createEvent = useCallback(async (eventData: Omit<Event, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.post(`${API_BASE_URL}/faculty/events`, eventData, getAuthHeaders());
      dispatch({ type: 'ADD_EVENT', payload: response.data.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to create event' });
      throw error;
    }
  }, [getAuthHeaders]);

  const updateEvent = useCallback(async (id: number, eventData: Omit<Event, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.put(`${API_BASE_URL}/faculty/events/${id}`, eventData, getAuthHeaders());
      dispatch({ type: 'UPDATE_EVENT', payload: response.data.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update event' });
      throw error;
    }
  }, [getAuthHeaders]);

  const deleteEvent = useCallback(async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      await axios.delete(`${API_BASE_URL}/faculty/events/${id}`, getAuthHeaders());
      dispatch({ type: 'DELETE_EVENT', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to delete event' });
      throw error;
    }
  }, [getAuthHeaders]);

  const fetchStudents = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/faculty/students`, getAuthHeaders());
      dispatch({ type: 'SET_STUDENTS', payload: response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch students' });
    }
  }, [getAuthHeaders]);

  const fetchAttendanceByEvent = async (eventId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/faculty/attendance/event/${eventId}`);
      dispatch({ type: 'SET_ATTENDANCE', payload: response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch attendance' });
    }
  };

  const markAttendance = async (eventId: number, attendanceRecords: any[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.post(`${API_BASE_URL}/faculty/attendance/mark`, {
        eventId,
        attendanceRecords
      });
      dispatch({ type: 'ADD_ATTENDANCE', payload: response.data.data || [] });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to mark attendance' });
      throw error;
    }
  };

  const fetchStats = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/faculty/dashboard-stats`, getAuthHeaders());
      dispatch({ type: 'SET_STATS', payload: response.data.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch stats' });
    }
  }, [getAuthHeaders]);

  const fetchAnalyticsSummary = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/faculty/analytics/summary`, getAuthHeaders());
      dispatch({ type: 'SET_ANALYTICS_SUMMARY', payload: response.data.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch analytics summary' });
    }
  }, [getAuthHeaders]);

  const fetchStudentAnalytics = useCallback(async (page = 0, size = 10, sortBy = 'attendancePercentage', sortDir = 'desc', searchTerm?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir,
      });
      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }
      const response = await axios.get(`${API_BASE_URL}/faculty/analytics/students?${params}`, getAuthHeaders());
      dispatch({ type: 'SET_STUDENT_ANALYTICS', payload: response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch student analytics' });
    }
  }, [getAuthHeaders]);

  const fetchStudentAttendanceDetails = useCallback(async (studentId: number, page = 0, size = 10, sortBy = 'markedAt', sortDir = 'desc') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir,
      });
      const response = await axios.get(`${API_BASE_URL}/faculty/analytics/students/${studentId}/attendance?${params}`, getAuthHeaders());
      dispatch({ type: 'SET_ATTENDANCE_DETAILS', payload: response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch attendance details' });
    }
  }, [getAuthHeaders]);

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: FacultyContextType = {
    state,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchStudents,
    fetchAttendanceByEvent,
    markAttendance,
    fetchStats,
    fetchAnalyticsSummary,
    fetchStudentAnalytics,
    fetchStudentAttendanceDetails,
    clearError,
  };

  return <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>;
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error('useFaculty must be used within a FacultyProvider');
  }
  return context;
};
