import React, { useState, useEffect } from 'react';
import { useStudent, Notification } from '../../context/StudentContext';
import { Bell, Check, AlertCircle, Info, CheckCircle, AlertTriangle, X, User, Calendar, BookOpen, GraduationCap } from 'lucide-react';

const StudentNotifications: React.FC = () => {
  const { state, fetchNotifications, markNotificationAsRead, deleteNotification } = useStudent();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        await fetchNotifications();
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'event_created':
      case 'event_updated':
      case 'event_cancelled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'attendance_marked':
      case 'attendance_updated':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'library_book_due':
      case 'library_book_overdue':
      case 'library_book_available':
        return <BookOpen className="w-5 h-5 text-orange-500" />;
      case 'grade_posted':
      case 'assignment_posted':
      case 'assignment_due':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'general_announcement':
        return <Info className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50 border border-gray-200';
    
    switch (type.toLowerCase()) {
      case 'event_created':
      case 'event_updated':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'attendance_marked':
      case 'attendance_updated':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'library_book_due':
      case 'library_book_overdue':
        return 'bg-orange-50 border-l-4 border-orange-500';
      case 'grade_posted':
      case 'assignment_posted':
      case 'assignment_due':
        return 'bg-purple-50 border-l-4 border-purple-500';
      case 'general_announcement':
        return 'bg-indigo-50 border-l-4 border-indigo-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'event_created': return 'New Event';
      case 'event_updated': return 'Event Updated';
      case 'event_cancelled': return 'Event Cancelled';
      case 'attendance_marked': return 'Attendance Marked';
      case 'attendance_updated': return 'Attendance Updated';
      case 'library_book_due': return 'Book Due';
      case 'library_book_overdue': return 'Book Overdue';
      case 'library_book_available': return 'Book Available';
      case 'grade_posted': return 'Grade Posted';
      case 'assignment_posted': return 'Assignment Posted';
      case 'assignment_due': return 'Assignment Due';
      case 'general_announcement': return 'Announcement';
      default: return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return <User className="w-4 h-4 text-red-500" />;
      case 'faculty': return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'student': return <User className="w-4 h-4 text-green-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredNotifications = state.notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.isRead;
      case 'read': return notification.isRead;
      default: return true;
    }
  });

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = state.notifications.filter(n => !n.isRead);
      for (const notification of unreadNotifications) {
        await markNotificationAsRead(notification.id);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your academic activities</p>
        </div>
        <div className="flex items-center space-x-4">
          {state.unreadNotificationCount > 0 && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full border border-red-200">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-semibold">{state.unreadNotificationCount} unread</span>
            </div>
          )}
          {state.unreadNotificationCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'All', count: state.notifications.length },
            { key: 'unread', label: 'Unread', count: state.unreadNotificationCount },
            { key: 'read', label: 'Read', count: state.notifications.length - state.unreadNotificationCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-card p-6 transition-all duration-300 hover:shadow-lg rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10 ${getNotificationBgColor(notification.type, notification.isRead)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-bold text-lg ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                          {notification.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          notification.type.toLowerCase().includes('event') ? 'bg-blue-100 text-blue-800' :
                          notification.type.toLowerCase().includes('attendance') ? 'bg-green-100 text-green-800' :
                          notification.type.toLowerCase().includes('library') ? 'bg-orange-100 text-orange-800' :
                          notification.type.toLowerCase().includes('grade') || notification.type.toLowerCase().includes('assignment') ? 'bg-purple-100 text-purple-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      
                      <p className={`mb-3 leading-relaxed ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(notification.fromUserRole)}
                          <span>From: {notification.fromUserName}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
                        title="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Bell className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {filter === 'all' ? 'No Notifications' : 
             filter === 'unread' ? 'No Unread Notifications' : 'No Read Notifications'}
          </h3>
          <p className="text-gray-600 text-lg">
            {filter === 'all' ? 'You don\'t have any notifications yet' :
             filter === 'unread' ? 'All caught up! No unread notifications' : 'No notifications have been read yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;