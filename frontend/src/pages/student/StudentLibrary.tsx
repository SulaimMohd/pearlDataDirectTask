import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { BookOpen, Calendar, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

const StudentLibrary: React.FC = () => {
  const { state } = useStudent();
  const [filter, setFilter] = useState<'all' | 'borrowed' | 'overdue' | 'returned'>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'borrowed': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'returned': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'borrowed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'returned': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-50 border-l-4 border-red-500';
      case 'borrowed': return 'bg-blue-50 border-l-4 border-blue-500';
      case 'returned': return 'bg-green-50 border-l-4 border-green-500';
      default: return 'bg-gray-50';
    }
  };

  const filteredBooks = state.libraryBooks.filter(book => {
    switch (filter) {
      case 'borrowed': return book.status === 'borrowed';
      case 'overdue': return book.status === 'overdue';
      case 'returned': return book.status === 'returned';
      default: return true;
    }
  });

  const borrowedCount = state.libraryBooks.filter(b => b.status === 'borrowed').length;
  const overdueCount = state.libraryBooks.filter(b => b.status === 'overdue').length;
  const returnedCount = state.libraryBooks.filter(b => b.status === 'returned').length;

  const totalFine = state.libraryBooks
    .filter(book => book.fine && book.fine > 0)
    .reduce((sum, book) => sum + (book.fine || 0), 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Books</h1>
          <p className="text-gray-600">Manage your borrowed books and track due dates</p>
        </div>
        <div className="flex items-center space-x-4">
          {totalFine > 0 && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-2 rounded-full">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Total Fine: ₹{totalFine}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">{borrowedCount} books borrowed</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Books</p>
              <p className="text-2xl font-bold text-blue-800">{state.libraryBooks.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Borrowed</p>
              <p className="text-2xl font-bold text-green-800">{borrowedCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-red-800">{overdueCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Total Fine</p>
              <p className="text-2xl font-bold text-purple-800">₹{totalFine}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card p-6">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'All Books', count: state.libraryBooks.length },
            { key: 'borrowed', label: 'Borrowed', count: borrowedCount },
            { key: 'overdue', label: 'Overdue', count: overdueCount },
            { key: 'returned', label: 'Returned', count: returnedCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Books List */}
      {filteredBooks.length > 0 ? (
        <div className="space-y-4">
          {filteredBooks.map((book) => {
            const daysUntilDue = book.status !== 'returned' ? getDaysUntilDue(book.dueDate) : 0;
            
            return (
              <div
                key={book.id}
                className={`glass-card p-6 transition-all duration-300 hover:shadow-lg ${getStatusBgColor(book.status)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(book.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
                        <p className="text-gray-600 mb-2">by {book.author}</p>
                        <p className="text-sm text-gray-500 mb-3">ISBN: {book.isbn}</p>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Due: {formatDate(book.dueDate)}
                            </span>
                          </div>
                          
                          {book.status === 'borrowed' && daysUntilDue > 0 && (
                            <span className="text-sm text-blue-600">
                              {daysUntilDue} days remaining
                            </span>
                          )}
                          
                          {book.status === 'overdue' && (
                            <span className="text-sm text-red-600">
                              {Math.abs(daysUntilDue)} days overdue
                            </span>
                          )}
                          
                          {book.fine && book.fine > 0 && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-red-600">
                                Fine: ₹{book.fine}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(book.status)}`}>
                          {book.status}
                        </span>
                        
                        {book.status === 'borrowed' && (
                          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                            Return Book
                          </button>
                        )}
                        
                        {book.status === 'overdue' && (
                          <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                            Pay Fine & Return
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {filter === 'all' ? 'No Books Found' : 
             filter === 'borrowed' ? 'No Borrowed Books' : 
             filter === 'overdue' ? 'No Overdue Books' : 'No Returned Books'}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'You don\'t have any library books yet' :
             filter === 'borrowed' ? 'You haven\'t borrowed any books' :
             filter === 'overdue' ? 'Great! No overdue books' : 'No books have been returned yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentLibrary;
