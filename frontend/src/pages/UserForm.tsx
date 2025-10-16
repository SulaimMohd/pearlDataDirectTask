import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { ArrowLeft, Save, User, Mail, FileText, Shield, Phone } from 'lucide-react';

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createUser, updateUser, getUser } = useUsers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT' as 'ADMIN' | 'FACULTY' | 'STUDENT',
    phoneNumber: '',
    bio: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing] = useState(!!id);

  useEffect(() => {
    if (isEditing && id) {
      const fetchUser = async () => {
        try {
          const user = await getUser(parseInt(id));
          if (user) {
            setFormData({
              name: user.name,
              email: user.email,
              role: user.role,
              phoneNumber: user.phoneNumber || '',
              bio: user.bio || ''
            });
          }
        } catch (error) {
          setError('Failed to load user data');
        }
      };
      fetchUser();
    }
  }, [id, isEditing, getUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && id) {
        await updateUser(parseInt(id), formData);
      } else {
        await createUser(formData);
      }
      navigate('/users');
    } catch (error: any) {
      setError(error.response?.data || 'An error occurred while saving the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update user information' : 'Create a new user account'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="floating-card">
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

          {/* Role Field */}
          <div className="space-y-2">
            <label htmlFor="role" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Shield className="w-4 h-4" />
              <span>Role *</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none"
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <label htmlFor="bio" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              <span>Bio</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 glass-button rounded-xl focus:outline-none resize-none"
              placeholder="Tell us about this user..."
            />
            <p className="text-xs text-gray-500">Optional: A brief description about the user</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 glass-card bg-red-50 border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 glass-button rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update User' : 'Create User'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
