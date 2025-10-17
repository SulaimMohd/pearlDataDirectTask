import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "container mx-auto px-4 py-8" : "min-h-screen"}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
