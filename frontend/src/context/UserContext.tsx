import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface User {
  id?: number;
  name: string;
  email: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users] };
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
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface UserContextType {
  state: UserState;
  fetchUsers: () => Promise<void>;
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  getUser: (id: number) => Promise<User | null>;
  searchUsers: (query: string) => Promise<User[]>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const fetchUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      dispatch({ type: 'SET_USERS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch users' });
    }
  };

  const createUser = async (userData: Omit<User, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData);
      dispatch({ type: 'ADD_USER', payload: response.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to create user' });
      throw error;
    }
  };

  const updateUser = async (id: number, userData: Omit<User, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
      dispatch({ type: 'UPDATE_USER', payload: response.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to update user' });
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      dispatch({ type: 'DELETE_USER', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to delete user' });
      throw error;
    }
  };

  const getUser = async (id: number): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`);
      return response.data;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to fetch user' });
      return null;
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data || 'Failed to search users' });
      return [];
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const value: UserContextType = {
    state,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    searchUsers,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
