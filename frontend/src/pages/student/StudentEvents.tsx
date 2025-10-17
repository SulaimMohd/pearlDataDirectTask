import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { Calendar, MapPin, Clock, User, Filter, Search } from 'lucide-react';

const StudentEvents: React.FC = () => {
  const { state, fetchEvents } = useStudent();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchEvents();
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchEvents]);

  const filteredEvents = state.events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || event.eventType.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'lecture': return 'from-blue-500 to-indigo-600';
      case 'workshop': return 'from-purple-500 to-pink-600';
      case 'seminar': return 'from-green-500 to-emerald-600';
      case 'exam': return 'from-red-500 to-orange-600';
      case 'assignment': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isEventUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Events</h1>
          <p className="text-gray-600">View your upcoming and past events</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-semibold text-gray-800">
            {filteredEvents.length} Events
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-button rounded-xl focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 glass-button rounded-xl focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="lecture">Lecture</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const { date, time } = formatDateTime(event.startTime);
            const upcoming = isEventUpcoming(event.startTime);
            
            return (
              <div key={event.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                    {event.description && (
                      <p className="text-gray-600 mb-3">{event.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    {upcoming && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getEventTypeColor(event.eventType)} mb-4`}>
                  {event.eventType}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium text-gray-800">{date} at {time}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">{event.location}</p>
                    </div>
                  </div>

                  {event.endTime && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium text-gray-800">
                          {Math.ceil((new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60))} hours
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {upcoming && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Starts in {Math.ceil((new Date(event.startTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No events are scheduled at the moment'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
