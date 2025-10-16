import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { ArrowLeft, Edit, Trash2, User, Mail, Calendar, FileText, Clock, Shield } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUser, deleteUser } = useUsers();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const userData = await getUser(parseInt(id));
        if (userData) {
          setUser(userData);
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, getUser]);

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;
    
    try {
      await deleteUser(user.id);
      navigate('/users');
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'FACULTY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STUDENT':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '👑';
      case 'FACULTY':
        return '👨‍🏫';
      case 'STUDENT':
        return '🎓';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="floating-card text-center">
          <div className="text-red-500 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The user you are looking for does not exist.'}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 glass-button rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
            >
              Go Back
            </button>
            <Link
              to="/users"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">User Details</h1>
            <p className="text-gray-600 mt-1">View and manage user information</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/users/${user.id}/edit`}
            className="flex items-center space-x-2 px-4 py-2 glass-button rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex items-center space-x-2 px-4 py-2 glass-button rounded-xl font-semibold hover:bg-red-50 hover:border-red-200 transition-all duration-300"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* User Information */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="floating-card text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-4">User ID: {user.id}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)} {user.role}
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-3 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
              </div>
              
              {user.updatedAt && user.updatedAt !== user.createdAt && (
                <div className="flex items-center justify-center space-x-3 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Updated {formatDate(user.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="floating-card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">User Information</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="p-4 glass-button rounded-xl bg-white/20">
                  <p className="text-gray-800 font-medium">{user.name}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="p-4 glass-button rounded-xl bg-white/20">
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="p-4 glass-button rounded-xl bg-white/20">
                  <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                    <span>{getRoleIcon(user.role)}</span>
                    <span>{user.role}</span>
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <div className="p-4 glass-button rounded-xl bg-white/20 min-h-[100px]">
                  {user.bio ? (
                    <p className="text-gray-800 leading-relaxed">{user.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="floating-card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Metadata</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
            <div className="p-3 glass-button rounded-xl bg-white/20">
              <p className="text-gray-800">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
            <div className="p-3 glass-button rounded-xl bg-white/20">
              <p className="text-gray-800">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${user?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default UserDetail;
