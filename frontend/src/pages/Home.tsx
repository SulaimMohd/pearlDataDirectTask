import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Database, Zap, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { state } = useAuth();
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'User Management',
      description: 'Create, read, update, and delete users with a beautiful interface.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'PostgreSQL Database',
      description: 'Robust data storage with PostgreSQL and JPA for enterprise-grade reliability.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast & Modern',
      description: 'Built with React, Vite, and Spring Boot for optimal performance.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with bcrypt password encryption for maximum security.',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="floating-card max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Welcome to PearlData
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A modern full-stack application built with React, Spring Boot, and PostgreSQL. 
            Experience the power of glass-morphism design with secure user management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {state.isAuthenticated ? (
              <>
                <Link
                  to="/users"
                  className="inline-flex items-center space-x-2 px-8 py-4 glass-button text-lg font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  <Users className="w-5 h-5" />
                  <span>View Users</span>
                </Link>
                <Link
                  to="/users/new"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Add User</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-8 py-4 glass-button text-lg font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text mb-4">Key Features</h2>
          <p className="text-gray-600 text-lg">Everything you need for modern user management</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="floating-card text-center group hover:scale-105 transition-all duration-300">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="floating-card max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">Tech Stack</h2>
          <p className="text-gray-600 text-lg">Built with modern technologies</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'React', color: 'from-blue-400 to-blue-600' },
            { name: 'TypeScript', color: 'from-blue-500 to-blue-700' },
            { name: 'Vite', color: 'from-purple-400 to-purple-600' },
            { name: 'Tailwind CSS', color: 'from-teal-400 to-teal-600' },
            { name: 'Spring Boot', color: 'from-green-400 to-green-600' },
            { name: 'PostgreSQL', color: 'from-blue-600 to-blue-800' },
            { name: 'Java', color: 'from-orange-400 to-orange-600' },
            { name: 'JPA/Hibernate', color: 'from-red-400 to-red-600' }
          ].map((tech, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center text-white font-bold text-sm`}>
                {tech.name.split(' ')[0]}
              </div>
              <p className="text-sm text-gray-600 font-medium">{tech.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Authentication Status Section */}
      {state.isAuthenticated && state.user && (
        <section className="floating-card max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold gradient-text mb-4">Welcome Back!</h2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                {state.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-800">{state.user.name}</p>
                <p className="text-sm text-gray-600">{state.user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                  state.user.role === 'ADMIN' ? 'bg-red-100 text-red-800 border-red-200' :
                  state.user.role === 'FACULTY' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {state.user.role}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">You're successfully logged in and can access all features.</p>
            <div className="flex space-x-4 justify-center">
              <Link
                to="/users"
                className="inline-flex items-center space-x-2 px-6 py-3 glass-button rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
