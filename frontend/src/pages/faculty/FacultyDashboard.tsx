import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  BookOpen,
  GraduationCap,
  BarChart3,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FacultyDashboard: React.FC = () => {
  const { state } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    // Mock data - in a real app, you'd fetch this from the API
    setStats({
      totalStudents: 25,
      totalEvents: 8,
      upcomingEvents: 3,
      attendanceRate: 87.5
    });
  }, []);

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Schedule a new lecture or lab',
      icon: <Calendar className="w-8 h-8" />,
      href: '/faculty/events/new',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Mark Attendance',
      description: 'Record student attendance',
      icon: <Clock className="w-8 h-8" />,
      href: '/faculty/attendance',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'View Students',
      description: 'Manage student information',
      icon: <Users className="w-8 h-8" />,
      href: '/faculty/students',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Analytics',
      description: 'View attendance reports',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '/faculty/analytics',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivities = [
    {
      title: 'Mathematics Lecture',
      type: 'Event',
      time: '2 hours ago',
      status: 'Completed'
    },
    {
      title: 'Physics Lab Attendance',
      type: 'Attendance',
      time: '1 day ago',
      status: 'Marked'
    },
    {
      title: 'New Student Added',
      type: 'Student',
      time: '2 days ago',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="floating-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Welcome back, {state.user?.name}!
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening in your faculty dashboard today.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="floating-card p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 leading-none">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="floating-card p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 leading-none">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="floating-card p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-3xl font-bold text-gray-900 leading-none">{stats.upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="floating-card p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
              <p className="text-3xl font-bold text-gray-900 leading-none">{stats.attendanceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="floating-card p-6 hover:scale-105 transition-all duration-300 group"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="floating-card p-6">
          <h2 className="text-xl font-bold gradient-text mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 glass-button rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.type} • {activity.time}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="floating-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold gradient-text">Upcoming Events</h2>
            <Link
              to="/faculty/events"
              className="flex items-center space-x-2 px-4 py-2 glass-button rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">View All</span>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 glass-button rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Mathematics Lecture</h3>
                <span className="text-sm text-gray-600">Today, 2:00 PM</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Advanced calculus topics</p>
              <p className="text-xs text-gray-500">Room 101 • 2 hours</p>
            </div>
            
            <div className="p-4 glass-button rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Physics Lab</h3>
                <span className="text-sm text-gray-600">Tomorrow, 10:00 AM</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Mechanics experiments</p>
              <p className="text-xs text-gray-500">Lab 205 • 3 hours</p>
            </div>
            
            <div className="p-4 glass-button rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Chemistry Seminar</h3>
                <span className="text-sm text-gray-600">Friday, 3:00 PM</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Organic chemistry basics</p>
              <p className="text-xs text-gray-500">Auditorium • 1.5 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
