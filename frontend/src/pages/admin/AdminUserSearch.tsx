import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, Edit, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const AdminUserSearch: React.FC = () => {
  const { state, deleteUser, searchUsers, fetchUsers } = useAdmin();
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(state.users);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: ''
  });

  // Fetch users on component mount
  useEffect(() => {
    if (state.users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, state.users.length]);

  useEffect(() => {
    setSearchResults(state.users);
  }, [state.users]);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        try {
          const results = await searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults(state.users);
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
        
        // Show success notification
        showSuccess(
          'User Deleted Successfully! 🗑️',
          `${deleteModal.userName} has been removed from the system`,
          4000
        );
        
        setDeleteModal({
          isOpen: false,
          userId: null,
          userName: ''
        });
      } catch (error: any) {
        console.error('Failed to delete user:', error);
        
        // Show error notification
        showError(
          'Delete Failed',
          error.response?.data?.message || 'Failed to delete user',
          5000
        );
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'FACULTY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Search</h1>
        <p className="text-gray-600">Search and manage users by name</p>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass-button rounded-xl focus:outline-none text-lg"
          />
        </div>
      </div>

      {/* Search Results */}
      {state.loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="glass-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-600 text-lg">
            {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((user) => (
            <div key={user.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)} {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 glass-button rounded-lg hover:bg-white/30">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
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
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
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

export default AdminUserSearch;
