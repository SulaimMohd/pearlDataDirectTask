import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { Search, Edit, Trash2, User, Mail, Calendar, Plus } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Users: React.FC = () => {
  const { state, deleteUser, searchUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(state.users);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: ''
  });

  useEffect(() => {
    setFilteredUsers(state.users);
  }, [state.users]);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        const results = await searchUsers(searchQuery);
        setFilteredUsers(results);
      } else {
        setFilteredUsers(state.users);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchUsers, state.users]);

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteModal({
      isOpen: true,
      userId: id,
      userName: name
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.userId) {
      try {
        await deleteUser(deleteModal.userId);
        setDeleteModal({
          isOpen: false,
          userId: null,
          userName: ''
        });
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      userId: null,
      userName: ''
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (state.loading && state.users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Users</h1>
          <p className="text-gray-600 mt-2">Manage your user database</p>
        </div>
        <Link
          to="/users/new"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass-button rounded-xl focus:outline-none"
          />
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="glass-card p-4 bg-red-50 border-red-200">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchQuery ? 'No users found' : 'No users yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Get started by adding your first user'
            }
          </p>
          {!searchQuery && (
            <Link
              to="/users/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Add First User</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="floating-card group hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/users/${user.id}/edit`}
                    className="p-2 glass-button rounded-lg hover:bg-white/30"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(user.id!, user.name)}
                    className="p-2 glass-button rounded-lg hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                {user.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/30">
                <Link
                  to={`/users/${user.id}`}
                  className="block w-full text-center py-2 glass-button rounded-lg hover:bg-white/30 transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Overlay */}
      {state.loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Users;
