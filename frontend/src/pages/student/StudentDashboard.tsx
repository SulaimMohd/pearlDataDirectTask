import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Bell, 
  Users,
  Clock,
  Award,
  Target
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { state, fetchDashboardStats, fetchProfile } = useStudent();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProfile(),
          fetchDashboardStats()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchProfile, fetchDashboardStats]);

  const statCards = [
    {
      title: 'Overall Attendance',
      value: state.dashboardStats?.attendancePercentage || 0,
      unit: '%',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Events',
      value: state.dashboardStats?.totalEvents || 0,
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      title: 'Upcoming Events',
      value: state.dashboardStats?.upcomingEvents || 0,
      icon: <Clock className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    },
    {
      title: 'Average Marks',
      value: state.dashboardStats?.averageMarks || 0,
      unit: '/100',
      icon: <Award className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    }
  ];

  const quickActions = [
    {
      title: 'View Progress',
      description: 'Check your academic progress',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/student/progress',
      color: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Upcoming Events',
      description: 'See your scheduled events',
      icon: <Calendar className="w-6 h-6" />,
      href: '/student/events',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Notifications',
      description: 'Check your notifications',
      icon: <Bell className="w-6 h-6" />,
      href: '/student/notifications',
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Library Books',
      description: 'Manage your borrowed books',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/student/library',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;
  const overdueBooks = state.libraryBooks.filter(b => b.status === 'overdue').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {state.profile?.name}!</h1>
          <p className="text-gray-600">Here's your academic overview</p>
        </div>
        <div className="flex items-center space-x-4">
          {unreadNotifications > 0 && (
            <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-2 rounded-full">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">{unreadNotifications} new notifications</span>
            </div>
          )}
          {overdueBooks > 0 && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-2 rounded-full">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{overdueBooks} overdue books</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className={`glass-card p-6 ${card.bgColor} border ${card.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${card.textColor} mb-1`}>{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}{card.unit}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="glass-card p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white`}>
                {action.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Notifications</h2>
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-3">
            {state.notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'error' ? 'bg-red-500' :
                  notification.type === 'warning' ? 'bg-orange-500' :
                  notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Library Books */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Library Books</h2>
            <BookOpen className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-3">
            {state.libraryBooks.slice(0, 3).map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{book.title}</p>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    book.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {book.status}
                  </span>
                  {book.fine && book.fine > 0 && (
                    <p className="text-xs text-red-600 mt-1">Fine: ₹{book.fine}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
