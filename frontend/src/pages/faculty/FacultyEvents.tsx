import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  BookOpen,
  Beaker,
  Presentation
} from 'lucide-react';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  eventType: string;
  status: string;
}

const FacultyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/faculty/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'lecture':
        return <Presentation className="w-5 h-5" />;
      case 'lab':
        return <Beaker className="w-5 h-5" />;
      case 'seminar':
        return <Users className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'seminar':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  const isToday = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-4 px-4 py-2 glass-button rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold gradient-text">Event Management</h1>
        <Link
          to="/faculty/events/new"
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No events found. Create your first event to get started!</p>
          <Link
            to="/faculty/events/new"
            className="inline-flex items-center space-x-2 mt-4 px-6 py-3 glass-button rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="floating-card p-6 hover:shadow-2xl transition-all duration-300">
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                    {getEventTypeIcon(event.eventType)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 glass-button rounded-lg hover:bg-white/30">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 glass-button rounded-lg hover:bg-red-50 hover:border-red-200">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                {event.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(event.startTime)}
                      {isToday(event.startTime) && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          Today
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Event Actions */}
              <div className="border-t border-white/30 pt-4">
                <div className="flex space-x-3">
                  {isUpcoming(event.startTime) ? (
                    <>
                      <button className="flex-1 text-center py-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300">
                        Edit Event
                      </button>
                      <button className="flex-1 text-center py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300">
                        Mark Attendance
                      </button>
                    </>
                  ) : (
                    <button className="w-full text-center py-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyEvents;
