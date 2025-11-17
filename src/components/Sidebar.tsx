import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/courses', label: 'Courses' },
    { path: '/attendance', label: 'Attendance' },
    { path: '/assessments', label: 'Assessments' },
    { path: '/marksheet', label: 'Mark Sheet' },
  ];

  const adminItems = [
    { path: '/students', label: 'Students', roles: ['Faculty', 'Admin'] },
    { path: '/analytics', label: 'Analytics', roles: ['Faculty', 'Admin'] },
    { path: '/faculty', label: 'Faculty', roles: ['Admin'] },
    { path: '/admin', label: 'Admin', roles: ['Admin'] },
    { path: '/report', label: 'Report', roles: ['Admin'] },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-100 p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 font-heading">IAIP</h1>
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link key={item.path} to={item.path} className={`block p-2 rounded transition ${isActive(item.path) ? 'bg-blue-600' : 'hover:bg-stone-800'}`}>
            {item.label}
          </Link>
        ))}
        {adminItems.map(item => (
          user && item.roles.includes(user.role) && (
            <Link key={item.path} to={item.path} className={`block p-2 rounded transition ${isActive(item.path) ? 'bg-blue-600' : 'hover:bg-stone-800'}`}>
              {item.label}
            </Link>
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
