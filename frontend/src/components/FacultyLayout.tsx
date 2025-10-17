import React, { useState } from 'react';
import FacultySidebar from './FacultySidebar';

interface FacultyLayoutProps {
  children: React.ReactNode;
}

const FacultyLayout: React.FC<FacultyLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="lg:pl-64 p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default FacultyLayout;
