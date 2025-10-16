import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Home, Plus, LogOut, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { state, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'FACULTY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STUDENT':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <nav className="glass-card rounded-none border-x-0 border-t-0 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">PearlData</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/')
                  ? 'glass-button text-primary-700'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white/20'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {state.isAuthenticated ? (
              <>
                <Link
                  to="/users"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/users')
                      ? 'glass-button text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-white/20'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </Link>

                <Link
                  to="/users/new"
                  className="flex items-center space-x-2 px-4 py-2 glass-button text-primary-700 hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/login')
                      ? 'glass-button text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-white/20'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center space-x-2 px-4 py-2 glass-button text-primary-700 hover:shadow-xl transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* User Profile & Logout */}
          {state.isAuthenticated && state.user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {state.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{state.user.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(state.user.role)}`}>
                    {state.user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 glass-button rounded-lg hover:bg-red-50 hover:border-red-200 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-red-500">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
