import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
      <AdminSidebar />
      <main className="lg:pl-64 p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
