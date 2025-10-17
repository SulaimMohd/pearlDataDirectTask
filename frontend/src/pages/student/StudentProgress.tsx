import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { TrendingUp, Award, Target, Calendar, BarChart3 } from 'lucide-react';

const StudentProgress: React.FC = () => {
  const { state, fetchProgress, fetchAttendance } = useStudent();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProgress(),
          fetchAttendance()
        ]);
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchProgress, fetchAttendance]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'from-green-500 to-emerald-600';
      case 'A': return 'from-blue-500 to-indigo-600';
      case 'B+': return 'from-yellow-500 to-orange-600';
      case 'B': return 'from-orange-500 to-red-600';
      case 'C+': return 'from-red-500 to-pink-600';
      case 'C': return 'from-gray-500 to-slate-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Academic Progress</h1>
          <p className="text-gray-600">Track your performance and achievements</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`glass-card p-4 bg-gradient-to-r ${getGradeColor(state.progress?.grade || 'C')}`}>
            <div className="flex items-center space-x-2 text-white">
              <Award className="w-6 h-6" />
              <span className="text-xl font-bold">Grade: {state.progress?.grade || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-1">Overall Attendance</p>
              <p className="text-3xl font-bold text-emerald-800">
                {state.progress?.overallAttendance || 0}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Events</p>
              <p className="text-3xl font-bold text-blue-800">
                {state.progress?.totalEvents || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Present Count</p>
              <p className="text-3xl font-bold text-purple-800">
                {state.progress?.presentCount || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Subject-wise Performance</h2>
          <BarChart3 className="w-6 h-6 text-gray-600" />
        </div>

        {state.progress?.subjectPerformance && Object.keys(state.progress.subjectPerformance).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(state.progress.subjectPerformance).map(([subject, data]) => (
              <div key={subject} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 capitalize">{subject}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {data.attended}/{data.totalEvents} events attended
                    </span>
                    {data.averageMarks && (
                      <span className="text-sm font-medium text-gray-800">
                        Avg: {data.averageMarks}/100
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Attendance Rate</span>
                      <span>{data.attendanceRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${data.attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No performance data available yet</p>
            <p className="text-sm text-gray-500">Attend events to see your progress here</p>
          </div>
        )}
      </div>

      {/* Recent Attendance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Attendance</h2>
          <Calendar className="w-6 h-6 text-gray-600" />
        </div>

        {state.attendance && state.attendance.length > 0 ? (
          <div className="space-y-3">
            {state.attendance.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    record.status === 'PRESENT' ? 'bg-green-500' :
                    record.status === 'LATE' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-800">{record.eventTitle}</p>
                    <p className="text-sm text-gray-600">{record.eventType} • {record.eventLocation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 capitalize">{record.status}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(record.eventDate).toLocaleDateString()}
                  </p>
                  {record.marksObtained && record.maxMarks && (
                    <p className="text-sm text-gray-600">
                      {record.marksObtained}/{record.maxMarks} marks
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No attendance records found</p>
            <p className="text-sm text-gray-500">Your attendance will appear here after attending events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
