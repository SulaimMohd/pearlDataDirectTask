import React, { useState, useEffect } from 'react';
import { useUsers } from '../../context/UserContext';
import { Users, GraduationCap, UserCheck, Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { state, fetchUsers } = useUsers();
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    faculty: 0,
    admins: 0
  });

  useEffect(() => {
    if (state.users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, state.users.length]);

  useEffect(() => {
    const newStats = {
      totalUsers: state.users.length,
      students: state.users.filter(user => user.role === 'STUDENT').length,
      faculty: state.users.filter(user => user.role === 'FACULTY').length,
      admins: state.users.filter(user => user.role === 'ADMIN').length
    };
    setStats(newStats);
  }, [state.users]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8" />,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700'
    },
    {
      title: 'Students',
      value: stats.students,
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Faculty',
      value: stats.faculty,
      icon: <UserCheck className="w-8 h-8" />,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-violet-50 to-purple-50',
      borderColor: 'border-violet-200',
      textColor: 'text-violet-700'
    },
    {
      title: 'Admins',
      value: stats.admins,
      icon: <Shield className="w-8 h-8" />,
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-red-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700'
    }
  ];

  const recentUsers = state.users.slice(0, 5);

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

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold gradient-text mb-3">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome to the system administration panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`floating-card p-6 ${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between h-full">
              <div className="flex flex-col justify-center">
                <p className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.title}</p>
                <p className="text-4xl font-bold text-gray-800 leading-none">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} text-white flex-shrink-0 shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="floating-card p-6 bg-gradient-to-br from-white/40 to-white/60">
        <h2 className="text-2xl font-bold gradient-text mb-6">Recent Users</h2>
        {recentUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-5 bg-white/70 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${
                    user.role === 'ADMIN' ? 'from-red-400 to-red-600' :
                    user.role === 'FACULTY' ? 'from-purple-400 to-purple-600' :
                    'from-green-400 to-green-600'
                  } rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 shadow-lg ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)} {user.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
