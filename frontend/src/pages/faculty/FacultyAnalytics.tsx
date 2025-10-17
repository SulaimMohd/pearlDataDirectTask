import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertTriangle,
  Search,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Star
} from 'lucide-react';
import { useFaculty, StudentAttendanceAnalytics, AnalyticsSummary, StudentAttendanceDetail } from '../../context/FacultyContext';

const FacultyAnalytics: React.FC = () => {
  const { state, fetchAnalyticsSummary, fetchStudentAnalytics, fetchStudentAttendanceDetails } = useFaculty();
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceAnalytics | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('attendancePercentage');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    fetchAnalyticsSummary();
    fetchStudentAnalytics(0, 10, sortBy, sortDir);
  }, [fetchAnalyticsSummary, fetchStudentAnalytics, sortBy, sortDir]);

  const handleStudentClick = async (student: StudentAttendanceAnalytics) => {
    setSelectedStudent(student);
    setShowDetails(true);
    await fetchStudentAttendanceDetails(student.studentId);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedStudent(null);
  };

  const handleSearch = () => {
    fetchStudentAnalytics(0, 10, sortBy, sortDir, searchTerm);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'text-green-600 bg-green-100';
      case 'Good':
        return 'text-blue-600 bg-blue-100';
      case 'Average':
        return 'text-yellow-600 bg-yellow-100';
      case 'Poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'text-green-600 bg-green-100';
      case 'ABSENT':
        return 'text-red-600 bg-red-100';
      case 'LATE':
        return 'text-yellow-600 bg-yellow-100';
      case 'EXCUSED':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (state.loading && !state.analyticsSummary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (showDetails && selectedStudent) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 px-4 py-2 glass-button rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Back to Analytics</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Student Details</h1>
              <p className="text-gray-600">{selectedStudent.studentName} - {selectedStudent.studentIdNumber}</p>
            </div>
          </div>
        </div>

        {/* Student Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-800">{selectedStudent.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-800">{selectedStudent.attendancePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Marks</p>
                <p className="text-2xl font-bold text-gray-800">{selectedStudent.averageMarks.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getGradeColor(selectedStudent.performanceGrade)}`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade</p>
                <p className="text-2xl font-bold text-gray-800">{selectedStudent.performanceGrade}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Details */}
        <div className="floating-card p-6">
          <h3 className="text-xl font-bold gradient-text mb-6">Attendance History</h3>
          <div className="space-y-4">
            {state.attendanceDetails.map((detail) => (
              <div key={detail.attendanceId} className="glass-card p-4 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{detail.eventTitle}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(detail.attendanceStatus)}`}>
                        {detail.attendanceStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(detail.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{detail.eventLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(detail.markedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {detail.marksObtained && detail.maxMarks && (
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">Marks: {detail.marksObtained}/{detail.maxMarks}</span>
                        <span className="text-gray-600">({detail.marksPercentage?.toFixed(1)}%)</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(detail.performanceStatus.charAt(0))}`}>
                          {detail.performanceStatus}
                        </span>
                      </div>
                    )}
                    {detail.remarks && (
                      <p className="mt-2 text-sm text-gray-600 italic">"{detail.remarks}"</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold gradient-text">Student Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 glass-button rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all duration-300"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      {state.analyticsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{state.analyticsSummary.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p className="text-2xl font-bold text-gray-800">{state.analyticsSummary.overallAttendanceRate}%</p>
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Marks</p>
                <p className="text-2xl font-bold text-gray-800">{state.analyticsSummary.overallAverageMarks}</p>
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Poor Attendance</p>
                <p className="text-2xl font-bold text-gray-800">{state.analyticsSummary.attendanceStatusDistribution.Poor}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Status Distribution */}
      {state.analyticsSummary && (
        <div className="floating-card p-6">
          <h3 className="text-xl font-bold gradient-text mb-6">Attendance Status Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Excellent</p>
              <p className="text-2xl font-bold text-green-600">{state.analyticsSummary.attendanceStatusDistribution.Excellent}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Good</p>
              <p className="text-2xl font-bold text-blue-600">{state.analyticsSummary.attendanceStatusDistribution.Good}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-2xl font-bold text-yellow-600">{state.analyticsSummary.attendanceStatusDistribution.Average}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-sm text-gray-600">Poor</p>
              <p className="text-2xl font-bold text-red-600">{state.analyticsSummary.attendanceStatusDistribution.Poor}</p>
            </div>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="floating-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold gradient-text">Student Performance</h3>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 glass-button rounded-lg focus:outline-none"
            >
              <option value="attendancePercentage">Attendance %</option>
              <option value="studentName">Name</option>
              <option value="averageMarks">Average Marks</option>
            </select>
            <button
              onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300"
            >
              {sortDir === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {state.studentAnalytics.map((student) => (
            <div
              key={student.studentId}
              className="glass-card p-4 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleStudentClick(student)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {student.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{student.studentName}</h4>
                    <p className="text-sm text-gray-600">{student.studentIdNumber} • {student.department}</p>
                    <p className="text-sm text-gray-600">{student.course} • {student.academicYear} • {student.semester}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-lg font-bold text-gray-800">{student.attendancePercentage.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Events</p>
                    <p className="text-lg font-bold text-gray-800">{student.totalEvents}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Marks</p>
                    <p className="text-lg font-bold text-gray-800">{student.averageMarks.toFixed(1)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Grade</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(student.performanceGrade)}`}>
                      {student.performanceGrade}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">View Details</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyAnalytics;
