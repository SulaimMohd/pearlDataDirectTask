import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, FileText, Phone, Lock, Calendar } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

interface AdminUserFormProps {
  userType: 'STUDENT' | 'FACULTY' | 'ADMIN';
}

const AdminUserForm: React.FC<AdminUserFormProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { createUserWithRole, state } = useAdmin();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    bio: '',
    // Student-specific fields
    studentId: '',
    department: '',
    course: '',
    academicYear: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    if (!/^\+91[6-9]\d{9}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid Indian mobile number starting with +91.');
      setLoading(false);
      return;
    }
    
    // Student-specific validation
    if (userType === 'STUDENT') {
      if (!formData.studentId) {
        setError('Student ID is required.');
        setLoading(false);
        return;
      }
      if (formData.studentId.length < 5 || formData.studentId.length > 20) {
        setError('Student ID must be between 5 and 20 characters.');
        setLoading(false);
        return;
      }
      if (!formData.department) {
        setError('Department is required.');
        setLoading(false);
        return;
      }
      if (!formData.course) {
        setError('Course is required.');
        setLoading(false);
        return;
      }
      if (!formData.academicYear) {
        setError('Academic Year is required.');
        setLoading(false);
        return;
      }
      if (!formData.semester) {
        setError('Semester is required.');
        setLoading(false);
        return;
      }
    }

    try {
      await createUserWithRole(formData, userType);
      
      // Show success notification
      const roleText = userType === 'STUDENT' ? 'Student' : userType === 'FACULTY' ? 'Faculty' : 'Admin';
      showSuccess(
        `${roleText} Created Successfully! 🎉`,
        `${formData.name} has been added to the system`,
        5000
      );
      
      // Navigate after a short delay to show the notification
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || state.error || 'Failed to create user';
      setError(errorMessage);
      
      // Show error notification
      showError(
        'User Creation Failed',
        errorMessage,
        6000
      );
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (userType) {
      case 'STUDENT':
        return 'Create Student';
      case 'FACULTY':
        return 'Create Faculty';
      case 'ADMIN':
        return 'Create Admin';
      default:
        return 'Create User';
    }
  };

  const getDescription = () => {
    switch (userType) {
      case 'STUDENT':
        return 'Add a new student to the system';
      case 'FACULTY':
        return 'Add a new faculty member to the system';
      case 'ADMIN':
        return 'Add a new administrator to the system';
      default:
        return 'Add a new user to the system';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{getTitle()}</h1>
          <p className="text-gray-600">{getDescription()}</p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center space-x-2 px-4 py-2 glass-button rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="glass-card p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                placeholder="Enter full name"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                placeholder="Enter email address"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4" />
                <span>Password *</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                placeholder="Enter password (min 6 characters)"
              />
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4" />
                <span>Phone Number *</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                placeholder="+91XXXXXXXXXX"
              />
              <p className="text-xs text-gray-500">Enter Indian mobile number with +91</p>
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <label htmlFor="bio" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Bio (Optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                placeholder="Tell us a little about the user..."
              ></textarea>
            </div>

            {/* Student-specific fields */}
            {userType === 'STUDENT' && (
              <>
                {/* Student ID Field */}
                <div className="space-y-2">
                  <label htmlFor="studentId" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    <span>Student ID *</span>
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                    placeholder="Enter student ID (5-20 characters, e.g., CS2024001)"
                    required
                  />
                </div>

                {/* Department Field */}
                <div className="space-y-2">
                  <label htmlFor="department" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    <span>Department *</span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                    placeholder="Enter department (e.g., Computer Science)"
                    required
                  />
                </div>

                {/* Course Field */}
                <div className="space-y-2">
                  <label htmlFor="course" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    <span>Course *</span>
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                    placeholder="Enter course (e.g., B.Tech, M.Tech)"
                    required
                  />
                </div>

                {/* Academic Year Field */}
                <div className="space-y-2">
                  <label htmlFor="academicYear" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>Academic Year *</span>
                  </label>
                  <select
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                    required
                  >
                    <option value="">Select Academic Year</option>
                    <option value="2024">2024-25</option>
                    <option value="2023">2023-24</option>
                    <option value="2022">2022-23</option>
                    <option value="2021">2021-22</option>
                  </select>
                </div>

                {/* Semester Field */}
                <div className="space-y-2">
                  <label htmlFor="semester" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>Semester *</span>
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>Create {userType}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUserForm;
