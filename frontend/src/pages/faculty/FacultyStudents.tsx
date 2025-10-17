import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, GraduationCap } from 'lucide-react';
import { useFaculty } from '../../context/FacultyContext';

const FacultyStudents: React.FC = () => {
  const { state, fetchStudents } = useFaculty();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filter students based on search query
  const filteredStudents = state.students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (state.loading && state.students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading students...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <p className="text-red-500 text-lg">{state.error}</p>
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
      {filteredStudents.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {state.students.length === 0 ? 'No students found.' : 'No students match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
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

                {student.studentId && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>ID: {student.studentId}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{student.department} - {student.course}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>Year {student.academicYear}, Sem {student.semester}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/30">
                <button className="w-full text-center py-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default FacultyStudents;
