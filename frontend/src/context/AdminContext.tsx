import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  password?: string;
  phoneNumber: string;
  bio?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalFaculty: number;
  totalAdmins: number;
}

interface AdminState {
  users: User[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: number }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: AdminState = {
  users: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
};

interface AdminContextType {
  state: AdminState;
  fetchUsers: () => Promise<void>;
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  createUserWithRole: (user: Omit<User, 'id'>, role: 'STUDENT' | 'FACULTY' | 'ADMIN') => Promise<void>;
  updateUser: (id: number, user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  getUser: (id: number) => Promise<User | null>;
  searchUsers: (query: string) => Promise<User[]>;
  fetchDashboardStats: () => Promise<DashboardStats | null>;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
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

  const fetchUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, getAuthHeaders());
      dispatch({ type: 'SET_USERS', payload: response.data.data?.content || response.data.data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch users' });
    }
  }, [getAuthHeaders]);

  const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/users`, userData, getAuthHeaders());
      dispatch({ type: 'ADD_USER', payload: response.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to create user' });
      throw error;
    }
  }, [getAuthHeaders]);

  const createUserWithRole = useCallback(async (userData: any, role: 'STUDENT' | 'FACULTY' | 'ADMIN') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const endpoint = `${API_BASE_URL}/admin/users/${role.toLowerCase()}`;
      
      // For now, only send the basic fields that the backend expects
      // TODO: Update backend to handle full student data
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        bio: userData.bio || ''
      };
      
      const response = await axios.post(endpoint, payload, getAuthHeaders());
      dispatch({ type: 'ADD_USER', payload: response.data.user });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to create user' });
      throw error;
    }
  }, [getAuthHeaders]);

  const updateUser = useCallback(async (id: number, userData: Omit<User, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${id}`, userData, getAuthHeaders());
      dispatch({ type: 'UPDATE_USER', payload: response.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to update user' });
      throw error;
    }
  }, [getAuthHeaders]);

  const deleteUser = useCallback(async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, getAuthHeaders());
      dispatch({ type: 'DELETE_USER', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to delete user' });
      throw error;
    }
  }, [getAuthHeaders]);

  const getUser = useCallback(async (id: number): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/${id}`, getAuthHeaders());
      return response.data.data;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to fetch user' });
      return null;
    }
  }, [getAuthHeaders]);

  const searchUsers = useCallback(async (query: string): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/search?q=${encodeURIComponent(query)}`, getAuthHeaders());
      return response.data.data;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to search users' });
      return [];
    }
  }, [getAuthHeaders]);

  const fetchDashboardStats = useCallback(async (): Promise<DashboardStats | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, getAuthHeaders());
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: response.data.data });
      return response.data.data;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch dashboard stats' });
      return null;
    }
  }, [getAuthHeaders]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AdminContextType = {
    state,
    fetchUsers,
    createUser,
    createUserWithRole,
    updateUser,
    deleteUser,
    getUser,
    searchUsers,
    fetchDashboardStats,
    clearError,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
