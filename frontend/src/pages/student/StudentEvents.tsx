import React, { useState, useEffect } from 'react';
import { useStudent, Event } from '../../context/StudentContext';
import { Calendar, MapPin, Clock, User, Filter, Search } from 'lucide-react';

// EventCard Component
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

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
      case 'scheduled': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const { date, time } = formatDateTime(event.startTime);
  const isUpcoming = new Date(event.startTime) > new Date();

  return (
    <div className="glass-card p-6 hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:scale-[1.02] group">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-gray-600 mb-3 leading-relaxed">{event.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(event.status)} shadow-sm`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Event Type Badge */}
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getEventTypeColor(event.eventType)} mb-6 shadow-lg`}>
        {event.eventType}
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Date & Time</p>
            <p className="font-semibold text-gray-800">{date} at {time}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Location</p>
            <p className="font-semibold text-gray-800">{event.location}</p>
          </div>
        </div>

        {event.endTime && (
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="font-semibold text-gray-800">
                {Math.ceil((new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60))} hours
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

  const filterEvents = (events: any[]) => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || event.eventType.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  };

  const filteredOngoing = state.groupedEvents ? filterEvents(state.groupedEvents.ongoing) : [];
  const filteredScheduled = state.groupedEvents ? filterEvents(state.groupedEvents.scheduled) : [];
  const filteredCompleted = state.groupedEvents ? filterEvents(state.groupedEvents.completed) : [];


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading events...</p>
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
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-green-600" />
            <span className="text-lg font-semibold text-gray-800">
              {state.eventsSummary?.ongoingCount || 0} Ongoing
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">
              {state.eventsSummary?.scheduledCount || 0} Scheduled
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              {state.eventsSummary?.completedCount || 0} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-gray-800 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-4 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-gray-800"
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

      {/* Events List - Grouped */}
      <div className="space-y-8">
        {/* Ongoing Events */}
        {filteredOngoing.length > 0 && (
          <div>
            <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
              <h2 className="text-2xl font-bold text-gray-800">Ongoing Events</h2>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                {filteredOngoing.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOngoing.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Events */}
        {filteredScheduled.length > 0 && (
          <div>
            <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
              <h2 className="text-2xl font-bold text-gray-800">Scheduled Events</h2>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200 shadow-sm">
                {filteredScheduled.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScheduled.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Events */}
        {filteredCompleted.length > 0 && (
          <div>
            <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
              <div className="w-4 h-4 bg-gray-500 rounded-full shadow-sm"></div>
              <h2 className="text-2xl font-bold text-gray-800">Completed Events</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold border border-gray-200 shadow-sm">
                {filteredCompleted.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCompleted.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* No Events Found */}
        {filteredOngoing.length === 0 && filteredScheduled.length === 0 && filteredCompleted.length === 0 && (
          <div className="glass-card p-12 text-center rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Events Found</h3>
            <p className="text-gray-600 text-lg">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any events scheduled yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEvents;
