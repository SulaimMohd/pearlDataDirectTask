import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, GraduationCap, Clock } from 'lucide-react';
import axios from 'axios';

interface Student {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  createdAt: string;
  role: string;
}

interface StudentAnalytics {
  studentId: number;
  studentName: string;
  studentEmail: string;
  totalPresentHours: number;
  totalAbsentHours: number;
  totalEvents: number;
  attendancePercentage: number;
}

const FacultyStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [analytics, setAnalytics] = useState<StudentAnalytics[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchAnalytics();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/faculty/students/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnalytics(response.data);
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const searchStudents = async () => {
    if (!searchQuery.trim()) {
      fetchStudents();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/faculty/students/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStudents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(searchStudents, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const getStudentAnalytics = (studentId: number) => {
    return analytics.find(a => a.studentId === studentId);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading students...</p>
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
            onClick={fetchStudents}
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
        <h1 className="text-3xl font-bold gradient-text">Student Management</h1>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-button rounded-xl focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {students.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No students found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => {
            const studentAnalytics = getStudentAnalytics(student.id);
            
            return (
              <div key={student.id} className="floating-card p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      STUDENT
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phoneNumber}</span>
                  </div>
                  
                  {student.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{student.bio}</p>
                  )}
                </div>

                {/* Analytics */}
                {studentAnalytics && (
                  <div className="border-t border-white/30 pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{studentAnalytics.totalPresentHours}</p>
                        <p className="text-xs text-gray-600">Present Hours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{studentAnalytics.totalAbsentHours}</p>
                        <p className="text-xs text-gray-600">Absent Hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Attendance</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAttendanceColor(studentAnalytics.attendancePercentage)}`}>
                        {studentAnalytics.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/30">
                  <button className="w-full text-center py-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyStudents;
