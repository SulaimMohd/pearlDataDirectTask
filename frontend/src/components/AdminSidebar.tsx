import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  UserCheck, 
  Shield, 
  Search,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, state } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <Users className="w-5 h-5" />,
      label: 'Dashboard',
      description: 'Overview of users'
    },
    {
      path: '/admin/users',
      icon: <Search className="w-5 h-5" />,
      label: 'Search Users',
      description: 'Find users by name'
    },
    {
      path: '/admin/users/student',
      icon: <GraduationCap className="w-5 h-5" />,
      label: 'Create Student',
      description: 'Add new student'
    },
    {
      path: '/admin/users/faculty',
      icon: <UserCheck className="w-5 h-5" />,
      label: 'Create Faculty',
      description: 'Add new faculty'
    },
    {
      path: '/admin/users/admin',
      icon: <Shield className="w-5 h-5" />,
      label: 'Create Admin',
      description: 'Add new admin'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 glass-button rounded-xl hover:bg-white/30 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-card transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20 bg-gradient-to-r from-red-50/30 to-pink-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
                <p className="text-sm text-gray-600 font-medium">System Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-red-50/20 to-pink-50/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {state.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{state.user?.name}</p>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-200 shadow-sm">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-2 border-red-200 shadow-lg'
                  : 'text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-md'
              }`}
            >
              {item.icon}
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-gradient-to-r from-red-50/20 to-pink-50/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
