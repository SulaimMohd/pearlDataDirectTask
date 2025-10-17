import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { Bell, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const StudentNotifications: React.FC = () => {
  const { state, markNotificationAsRead } = useStudent();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50';
    
    switch (type) {
      case 'error': return 'bg-red-50 border-l-4 border-red-500';
      case 'warning': return 'bg-orange-50 border-l-4 border-orange-500';
      case 'success': return 'bg-green-50 border-l-4 border-green-500';
      case 'info': return 'bg-blue-50 border-l-4 border-blue-500';
      default: return 'bg-gray-50';
    }
  };

  const filteredNotifications = state.notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.isRead;
      case 'read': return notification.isRead;
      default: return true;
    }
  });

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    state.notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your academic activities</p>
        </div>
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-2 rounded-full">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">{unreadCount} unread</span>
            </div>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card p-6">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'All', count: state.notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: state.notifications.length - unreadCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
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
              className={`glass-card p-6 transition-all duration-300 hover:shadow-lg ${getNotificationBgColor(notification.type, notification.isRead)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold mb-2 ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      <p className={`mb-3 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.type === 'error' ? 'bg-red-100 text-red-800' :
                        notification.type === 'warning' ? 'bg-orange-100 text-orange-800' :
                        notification.type === 'success' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.type}
                      </span>
                      
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {filter === 'all' ? 'No Notifications' : 
             filter === 'unread' ? 'No Unread Notifications' : 'No Read Notifications'}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'You don\'t have any notifications yet' :
             filter === 'unread' ? 'All caught up! No unread notifications' : 'No notifications have been read yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
