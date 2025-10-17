import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (state.user?.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
