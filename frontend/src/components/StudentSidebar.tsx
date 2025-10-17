import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp,
  Calendar, 
  Bell, 
  BookOpen,
  LogOut, 
  Menu, 
  X, 
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface StudentSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: BarChart3,
      current: location.pathname === '/student/dashboard'
    },
    {
      name: 'Progress',
      href: '/student/progress',
      icon: TrendingUp,
      current: location.pathname === '/student/progress' || location.pathname.startsWith('/student/progress')
    },
    {
      name: 'Events',
      href: '/student/events',
      icon: Calendar,
      current: location.pathname === '/student/events' || location.pathname.startsWith('/student/events')
    },
    {
      name: 'Notifications',
      href: '/student/notifications',
      icon: Bell,
      current: location.pathname === '/student/notifications' || location.pathname.startsWith('/student/notifications')
    },
    {
      name: 'Library',
      href: '/student/library',
      icon: BookOpen,
      current: location.pathname === '/student/library' || location.pathname.startsWith('/student/library')
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="glass-card p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-r border-purple-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-purple-200">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">Student Portal</span>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {state.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{state.user?.name}</p>
                <p className="text-xs text-gray-600">Student</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    item.current
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-6 border-t border-purple-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default StudentSidebar;
