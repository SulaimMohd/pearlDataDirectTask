import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Users,
  Save,
  Calendar,
  MapPin
} from 'lucide-react';
import { useFaculty, Event } from '../../context/FacultyContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AttendanceRecord {
  studentId: number;
  status: string;
  remarks?: string;
  marksObtained?: number;
  maxMarks?: number;
}

const FacultyAttendance: React.FC = () => {
  const { state, fetchStudents, fetchEvents } = useFaculty();
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<(Event & { id: number }) | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper functions for time validation
  const isEventScheduledTimeReached = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.startTime);
    return now >= eventStart;
  };


  const canMarkAttendance = (event: Event) => {
    return isEventScheduledTimeReached(event) && !isEventCompleted(event);
  };

  const getTimeStatusMessage = (event: Event) => {
    if (isEventCompleted(event)) {
      return 'This event has been completed and cannot be edited.';
    }
    
    const now = new Date();
    const eventStart = new Date(event.startTime);
    
    if (now < eventStart) {
      const timeUntil = Math.ceil((eventStart.getTime() - now.getTime()) / (1000 * 60));
      return `Attendance can only be marked after the scheduled time. Event starts in ${timeUntil} minutes.`;
    }
    
    return 'You can now mark attendance for this event.';
  };

  const handleEventSelect = (event: Event) => {
    if (event.id) {
      // Check if event is completed - don't allow selection
      if (isEventCompleted(event)) {
        setError('Cannot mark attendance for completed events.');
        return;
      }

      setSelectedEvent(event as Event & { id: number });
      // Initialize attendance records for all students
      const initialRecords: AttendanceRecord[] = state.students.map(student => ({
        studentId: student.id!,
        status: 'PRESENT', // Default to present
        remarks: '',
        marksObtained: 0,
        maxMarks: 100 // Default max marks
      }));
      setAttendanceRecords(initialRecords);
      setError('');
      setSuccess('');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchEvents();
  }, [fetchStudents, fetchEvents]);

  // Auto-select event if eventId is provided in URL
  useEffect(() => {
    if (eventId && state.events.length > 0) {
      const event = state.events.find(e => e.id?.toString() === eventId);
      if (event) {
        handleEventSelect(event);
      }
    }
  }, [eventId, state.events]);

  const updateAttendanceStatus = (studentId: number, status: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, status }
          : record
      )
    );
  };

  const updateRemarks = (studentId: number, remarks: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, remarks }
          : record
      )
    );
  };

  const updateMarks = (studentId: number, field: 'marksObtained' | 'maxMarks', value: number) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, [field]: value }
          : record
      )
    );
  };

  const getAttendanceStatus = (studentId: number) => {
    const record = attendanceRecords.find(r => r.studentId === studentId);
    return record?.status || 'PRESENT';
  };

  const getRemarks = (studentId: number) => {
    const record = attendanceRecords.find(r => r.studentId === studentId);
    return record?.remarks || '';
  };

  const getMarks = (studentId: number, field: 'marksObtained' | 'maxMarks') => {
    const record = attendanceRecords.find(r => r.studentId === studentId);
    return record?.[field] || (field === 'maxMarks' ? 100 : 0);
  };

  const saveAttendance = async () => {
    if (!selectedEvent) return;

    // Check if attendance can be marked
    if (!canMarkAttendance(selectedEvent)) {
      setError(getTimeStatusMessage(selectedEvent));
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/faculty/attendance/enhanced',
        {
          eventId: selectedEvent.id,
          attendanceRecords: attendanceRecords.map(record => ({
            studentId: record.studentId,
            status: record.status,
            marksObtained: record.marksObtained || 0,
            maxMarks: record.maxMarks || 100,
            remarks: record.remarks || null
          })),
          markEventAsCompleted: true // Automatically mark event as completed when attendance is saved
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle enhanced response
      if (response.data.success) {
        const { message, attendanceSummary, eventSummary } = response.data;
        
        let successMessage = message;
        if (eventSummary?.statusChanged) {
          successMessage += ` Event status updated from ${eventSummary.previousStatus} to ${eventSummary.currentStatus}.`;
        }
        
        successMessage += ` Attendance: ${attendanceSummary.presentCount + attendanceSummary.lateCount}/${attendanceSummary.totalStudents} students (${attendanceSummary.attendancePercentage.toFixed(1)}%)`;
        
        if (attendanceSummary.averageMarks > 0) {
          successMessage += ` | Average Marks: ${attendanceSummary.averageMarks.toFixed(1)}`;
        }
        
        setSuccess(successMessage);
        
        // Redirect to attendance page after a short delay
        setTimeout(() => {
          navigate('/faculty/attendance');
        }, 2000);
        
      } else {
        setSuccess(response.data.message || 'Attendance and marks saved successfully');
        
        // Redirect to attendance page after a short delay
        setTimeout(() => {
          navigate('/faculty/attendance');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save attendance and marks');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ABSENT':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'LATE':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ABSENT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper functions for event grouping and sorting
  const isEventScheduled = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.startTime);
    return eventStart > now && event.status === 'SCHEDULED';
  };

  const isEventCompleted = (event: Event) => {
    const now = new Date();
    const eventEnd = new Date(event.endTime);
    return eventEnd < now || event.status === 'COMPLETED' || event.status === 'CANCELLED';
  };

  const sortEventsByDate = (events: Event[]) => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const groupEventsByDate = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    events.forEach(event => {
      const date = new Date(event.startTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    
    return grouped;
  };

  // Helper function for active events (can be marked for attendance)
  const isEventActive = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    return now >= eventStart && now <= eventEnd && event.status === 'SCHEDULED';
  };

  const scheduledEvents = sortEventsByDate(state.events.filter(isEventScheduled));
  const activeEvents = sortEventsByDate(state.events.filter(isEventActive));
  const completedEvents = sortEventsByDate(state.events.filter(isEventCompleted));
  const scheduledEventsByDate = groupEventsByDate(scheduledEvents);
  const activeEventsByDate = groupEventsByDate(activeEvents);
  const completedEventsByDate = groupEventsByDate(completedEvents);

  // Component for rendering event groups
  const renderEventGroup = (eventsByDate: { [key: string]: Event[] }, title: string, emptyMessage: string) => {
    const totalEvents = Object.values(eventsByDate).flat().length;
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold gradient-text flex items-center space-x-2">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-500">({totalEvents} events)</span>
        </h3>
        
        {totalEvents === 0 ? (
          <div className="glass-card p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(eventsByDate).map(([groupDate, groupEvents]) => (
              <div key={groupDate} className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                  {groupDate}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventSelect(event)}
                    disabled={isEventCompleted(event)}
                    className={`p-4 glass-button rounded-xl transition-all duration-300 text-left group ${
                      isEventCompleted(event) 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-white/30'
                    }`}
                  >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                            {event.title}
                          </h5>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600">{event.eventType}</p>
                            {isEventCompleted(event) && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                Completed
                              </span>
                            )}
                            {isEventActive(event) && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Active Now
                              </span>
                            )}
                            {!canMarkAttendance(event) && !isEventCompleted(event) && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Not Started
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(event.startTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(event.endTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (state.loading && (state.students.length === 0 || state.events.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold gradient-text">Mark Attendance</h1>
        {selectedEvent && (
          <button
            onClick={saveAttendance}
            disabled={saving || !canMarkAttendance(selectedEvent)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              canMarkAttendance(selectedEvent)
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } disabled:opacity-50`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>
              {saving ? 'Saving...' : 
               !canMarkAttendance(selectedEvent) ? 'Cannot Save Yet' : 
               'Save Attendance & Marks'}
            </span>
          </button>
        )}
      </div>

      {/* Messages */}
      {(error || state.error) && (
        <div className="glass-card p-4 border border-red-200 bg-red-50">
          <p className="text-red-600">{error || state.error}</p>
        </div>
      )}

      {success && (
        <div className="glass-card p-4 border border-green-200 bg-green-50">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Event Selection */}
      {!selectedEvent && (
        <div className="space-y-8">
          {/* Active Events Section */}
          <div className="floating-card p-6">
            {renderEventGroup(
              activeEventsByDate,
              '🎯 Active Events (Can Mark Attendance)',
              'No active events found. Events will appear here when they start.'
            )}
          </div>

          {/* Scheduled Events Section */}
          <div className="floating-card p-6">
            {renderEventGroup(
              scheduledEventsByDate,
              '📅 Upcoming Events',
              'No upcoming events found. Create events to mark attendance.'
            )}
          </div>

          {/* Completed Events Section */}
          <div className="floating-card p-6">
            {renderEventGroup(
              completedEventsByDate,
              '✅ Completed Events',
              'No completed events found. Events will appear here after they end.'
            )}
          </div>
        </div>
      )}

      {/* Attendance Marking */}
      {selectedEvent && (
        <div className="space-y-6">
          {/* Selected Event Info */}
          <div className="floating-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold gradient-text">{selectedEvent.title}</h2>
                <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedEvent.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedEvent.startTime).toLocaleTimeString()} - {new Date(selectedEvent.endTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                {/* Time Status Message */}
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  canMarkAttendance(selectedEvent) 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  {getTimeStatusMessage(selectedEvent)}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 glass-button rounded-xl hover:bg-white/30 transition-all duration-300"
              >
                Change Event
              </button>
            </div>
          </div>

          {/* Students List */}
          <div className="floating-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text">Student Attendance</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{state.students.length} students</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.students.map((student) => {
                const currentStatus = getAttendanceStatus(student.id!);
                const currentRemarks = getRemarks(student.id!);
                const marksObtained = getMarks(student.id!, 'marksObtained');
                const maxMarks = getMarks(student.id!, 'maxMarks');

                return (
                  <div key={student.id} className="glass-card p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="flex space-x-2 mb-3">
                      {['PRESENT', 'ABSENT', 'LATE'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateAttendanceStatus(student.id!, status)}
                          className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            currentStatus === status
                              ? getStatusColor(status)
                              : 'glass-button hover:bg-white/30'
                          }`}
                        >
                          {getStatusIcon(status)}
                          <span>{status}</span>
                        </button>
                      ))}
                    </div>

                    {/* Marks Input */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={marksObtained}
                          onChange={(e) => updateMarks(student.id!, 'marksObtained', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 glass-button rounded-lg text-sm focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Max Marks
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={maxMarks}
                          onChange={(e) => updateMarks(student.id!, 'maxMarks', parseInt(e.target.value) || 100)}
                          className="w-full px-3 py-2 glass-button rounded-lg text-sm focus:outline-none"
                          placeholder="100"
                        />
                      </div>
                    </div>

                    {/* Remarks */}
                    <textarea
                      placeholder="Add remarks (optional)..."
                      value={currentRemarks}
                      onChange={(e) => updateRemarks(student.id!, e.target.value)}
                      className="w-full px-3 py-2 glass-button rounded-lg text-sm focus:outline-none resize-none"
                      rows={2}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;
