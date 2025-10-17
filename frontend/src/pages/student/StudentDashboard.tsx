import React, { useState, useEffect } from 'react';
import { useStudent, Notification } from '../../context/StudentContext';
import { 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Bell, 
  Users,
  Clock,
  Award,
  Target,
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  GraduationCap,
  User,
  X
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { state, fetchDashboardStats, fetchProfile, fetchRecentNotifications, markNotificationAsRead } = useStudent();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProfile(),
          fetchDashboardStats(),
          fetchRecentNotifications()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchProfile, fetchDashboardStats, fetchRecentNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'event_created':
      case 'event_updated':
      case 'event_cancelled':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'attendance_marked':
      case 'attendance_updated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'library_book_due':
      case 'library_book_overdue':
      case 'library_book_available':
        return <BookOpen className="w-4 h-4 text-orange-500" />;
      case 'grade_posted':
      case 'assignment_posted':
      case 'assignment_due':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case 'general_announcement':
        return <Info className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return <User className="w-3 h-3 text-red-500" />;
      case 'faculty': return <GraduationCap className="w-3 h-3 text-blue-500" />;
      case 'student': return <User className="w-3 h-3 text-green-500" />;
      default: return <User className="w-3 h-3 text-gray-500" />;
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const statCards = [
    {
      title: 'Overall Attendance',
      value: state.dashboardStats?.attendancePercentage || 0,
      unit: '%',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100'
    },
    {
      title: 'Total Events',
      value: state.dashboardStats?.totalEvents || 0,
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Upcoming Events',
      value: state.dashboardStats?.upcomingEvents || 0,
      icon: <Clock className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Average Marks',
      value: state.dashboardStats?.averageMarks || 0,
      unit: '/100',
      icon: <Award className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-100'
    }
  ];

  const quickActions = [
    {
      title: 'View Progress',
      description: 'Check your academic progress',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/student/progress',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Upcoming Events',
      description: 'See your scheduled events',
      icon: <Calendar className="w-6 h-6" />,
      href: '/student/events',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Notifications',
      description: 'Check your notifications',
      icon: <Bell className="w-6 h-6" />,
      href: '/student/notifications',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      badge: state.unreadNotificationCount > 0 ? state.unreadNotificationCount : null
    },
    {
      title: 'Library Books',
      description: 'Manage your borrowed books',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/student/library',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    }
  ];

  const overdueBooks = state.libraryBooks.filter(b => b.status === 'overdue').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{state.profile?.name}</span>!
          </h1>
          <p className="text-gray-600 text-lg">Here's your academic overview for today</p>
        </div>
        <div className="flex items-center space-x-4">
          {state.unreadNotificationCount > 0 && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full border border-orange-200 shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-semibold">{state.unreadNotificationCount} new notifications</span>
            </div>
          )}
          {overdueBooks > 0 && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-4 py-2 rounded-full border border-red-200 shadow-sm">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-semibold">{overdueBooks} overdue books</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className={`glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${card.bgColor} ${card.borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-semibold ${card.textColor} mb-2`}>{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor}`}>
                  {card.value}{card.unit}
                </p>
              </div>
              <div className={`p-4 rounded-2xl ${card.iconBg} shadow-lg`}>
                <div className={`text-white bg-gradient-to-r ${card.color} p-2 rounded-xl`}>
                  {card.icon}
                </div>
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
            className={`glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative ${action.bgColor} ${action.borderColor}`}
          >
            {action.badge && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {action.badge}
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${action.color} text-white shadow-lg`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notifications */}
        <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Notifications</h2>
            </div>
            {state.unreadNotificationCount > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold border border-red-200">
                {state.unreadNotificationCount} unread
              </span>
            )}
          </div>
          <div className="space-y-4">
            {state.notifications.slice(0, 4).map((notification) => (
              <div key={notification.id} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                notification.isRead 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${
                          notification.isRead ? 'text-gray-600' : 'text-gray-800'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mb-2 ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(notification.fromUserRole)}
                            <span>From: {notification.fromUserName}</span>
                          </div>
                          <span>•</span>
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50"
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {state.notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Library Books */}
        <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Library Books</h2>
            </div>
            {overdueBooks > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold border border-red-200">
                {overdueBooks} overdue
              </span>
            )}
          </div>
          <div className="space-y-4">
            {state.libraryBooks.slice(0, 4).map((book) => (
              <div key={book.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <p className="text-xs text-gray-500">Due: {book.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      book.status === 'overdue' ? 'bg-red-100 text-red-800 border border-red-200' :
                      book.status === 'borrowed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {book.status}
                    </span>
                    {book.fine && book.fine > 0 && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">Fine: ₹{book.fine}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {state.libraryBooks.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No books borrowed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;