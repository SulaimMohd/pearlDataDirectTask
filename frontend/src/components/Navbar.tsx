import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Home, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
