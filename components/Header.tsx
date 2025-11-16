import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, Role } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

interface NavLinkInfo {
  name: string;
  path: string;
  roles: Role[];
}

const allNavLinks: NavLinkInfo[] = [
  { name: 'Home', path: '/home', roles: ['Student', 'Faculty', 'Admin'] },
  { name: 'Dashboard', path: '/dashboard', roles: ['Student', 'Faculty', 'Admin'] },
  { name: 'Courses', path: '/courses', roles: ['Student', 'Faculty', 'Admin'] },
  { name: 'Attendance', path: '/attendance', roles: ['Student', 'Faculty', 'Admin'] },
  { name: 'Assessments', path: '/assessments', roles: ['Student', 'Faculty', 'Admin'] },
  { name: 'Mark Sheet', path: '/marksheet', roles: ['Student', 'Faculty', 'Admin'] },
  { name: 'Students', path: '/students', roles: ['Faculty', 'Admin'] },
  { name: 'Analytics', path: '/analytics', roles: ['Faculty', 'Admin'] },
  { name: 'Faculty', path: '/faculty', roles: ['Admin'] },
  { name: 'Admin', path: '/admin', roles: ['Admin'] },
  { name: 'Report', path: '/report', roles: ['Admin'] },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = user ? allNavLinks.filter(link => link.roles.includes(user.role)) : [];

  const activeLinkStyle = {
    color: '#CF5256',
    borderBottom: '2px solid #CF5256'
  };

  return (
    <header className="bg-white/80 dark:bg-[#303030]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-stone-200 dark:border-stone-700/50 print:hidden">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/home" className="text-2xl font-heading font-bold text-stone-900 dark:text-[#FAF4F4]">
              IAI <span className="text-[#CF5256]">Portal</span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end
                  className="text-stone-600 dark:text-[#FAF4F4] hover:text-[#CF5256] px-3 py-2 text-sm font-medium transition-colors duration-200"
                  style={({ isActive }) => isActive ? activeLinkStyle : {}}
                >
                  {link.name}
                </NavLink>
              ))}
               <ThemeToggle />
               {user && (
                <button
                  onClick={logout}
                  className="text-stone-600 dark:text-stone-300 hover:text-[#CF5256] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-stone-200 dark:bg-stone-800 inline-flex items-center justify-center p-2 rounded-md text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-300 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-100 dark:focus:ring-offset-stone-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end
                onClick={() => setIsOpen(false)}
                className="text-stone-600 dark:text-[#FAF4F4] hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                style={({ isActive }) => isActive ? activeLinkStyle : {}}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="px-3 py-2">
                <ThemeToggle />
            </div>
             {user && (
                <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="text-left w-full text-stone-600 dark:text-[#FAF4F4] hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                    Logout
                </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;