import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface StudentRouteProps {
  children: React.ReactNode;
}

const StudentRoute: React.FC<StudentRouteProps> = ({ children }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (state.user?.role !== 'STUDENT') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default StudentRoute;
