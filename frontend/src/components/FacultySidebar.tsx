import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap,
  Clock,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FacultySidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const FacultySidebar: React.FC<FacultySidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
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
      href: '/faculty/dashboard',
      icon: BarChart3,
      current: location.pathname === '/faculty/dashboard'
    },
    {
      name: 'Events',
      href: '/faculty/events',
      icon: Calendar,
      current: location.pathname === '/faculty/events' || location.pathname.startsWith('/faculty/events')
    },
    {
      name: 'Students',
      href: '/faculty/students',
      icon: Users,
      current: location.pathname === '/faculty/students' || location.pathname.startsWith('/faculty/students')
    },
    {
      name: 'Attendance',
      href: '/faculty/attendance',
      icon: Clock,
      current: location.pathname === '/faculty/attendance' || location.pathname.startsWith('/faculty/attendance')
    },
    {
      name: 'Analytics',
      href: '/faculty/analytics',
      icon: BookOpen,
      current: location.pathname === '/faculty/analytics' || location.pathname.startsWith('/faculty/analytics')
    }
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
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
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Faculty Portal</h1>
                  <p className="text-sm text-gray-600">Manage Classes</p>
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

          {/* Faculty Info */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {state.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{state.user?.name}</p>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  FACULTY
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    item.current
                      ? 'glass-button text-purple-700 bg-purple-50 border-purple-200'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-white/20'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
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

export default FacultySidebar;
