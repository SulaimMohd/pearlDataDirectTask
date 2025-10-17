import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FacultyRouteProps {
  children: React.ReactNode;
}

const FacultyRoute: React.FC<FacultyRouteProps> = ({ children }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (state.user?.role !== 'FACULTY') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default FacultyRoute;
