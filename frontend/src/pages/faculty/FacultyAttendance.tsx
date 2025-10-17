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
import axios from 'axios';

interface Student {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  bio?: string;
}

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

interface AttendanceRecord {
  studentId: number;
  status: string;
  remarks?: string;
}

const FacultyAttendance: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchEvents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/faculty/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStudents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch students');
    }
  };

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

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    // Initialize attendance records for all students
    const initialRecords: AttendanceRecord[] = students.map(student => ({
      studentId: student.id,
      status: 'PRESENT', // Default to present
      remarks: ''
    }));
    setAttendanceRecords(initialRecords);
  };

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

  const getAttendanceStatus = (studentId: number) => {
    const record = attendanceRecords.find(r => r.studentId === studentId);
    return record?.status || 'PRESENT';
  };

  const getRemarks = (studentId: number) => {
    const record = attendanceRecords.find(r => r.studentId === studentId);
    return record?.remarks || '';
  };

  const saveAttendance = async () => {
    if (!selectedEvent) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/faculty/attendance',
        {
          eventId: selectedEvent.id,
          attendanceRecords: attendanceRecords
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(response.data.message || 'Attendance marked successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to mark attendance');
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

  if (loading) {
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
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="glass-card p-4 border border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="glass-card p-4 border border-green-200 bg-green-50">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Event Selection */}
      {!selectedEvent && (
        <div className="floating-card p-6">
          <h2 className="text-xl font-bold gradient-text mb-4">Select an Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventSelect(event)}
                className="p-4 glass-button rounded-xl hover:bg-white/30 transition-all duration-300 text-left"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.eventType}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString()}</span>
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
                <span>{students.length} students</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => {
                const currentStatus = getAttendanceStatus(student.id);
                const currentRemarks = getRemarks(student.id);

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
                          onClick={() => updateAttendanceStatus(student.id, status)}
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

                    {/* Remarks */}
                    <textarea
                      placeholder="Add remarks (optional)..."
                      value={currentRemarks}
                      onChange={(e) => updateRemarks(student.id, e.target.value)}
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
