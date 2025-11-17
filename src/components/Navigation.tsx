import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-stone-900 shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">IAIP</h1>
        <div className="flex gap-6">
          <Link to="/home" className="text-stone-300 hover:text-white">Home</Link>
          <Link to="/dashboard" className="text-stone-300 hover:text-white">Dashboard</Link>
          <button className="text-stone-300 hover:text-white">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
