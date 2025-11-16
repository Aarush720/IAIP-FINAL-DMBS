import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen text-stone-800 dark:text-[#FAF4F4] flex flex-col transition-colors duration-300">
      <Header />
      <main key={location.pathname} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-page-transition">
        <Outlet />
      </main>
      {/* A simple footer can be added here if needed */}
    </div>
  );
};

export default Layout;