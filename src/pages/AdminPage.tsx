import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../services/api';
import { User } from '../types';
import { Role } from '../contexts/AuthContext';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'All' | Role>('All');

  useEffect(() => {
    api.getAdminUsers()
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => { setError('Failed to fetch user data.'); setLoading(false); });
  }, []);

  const filteredUsers = useMemo(() => filter === 'All' ? users : users.filter(user => user.role === filter), [users, filter]);

  const toggleStatus = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 dark:bg-red-500/30 text-red-700 dark:text-red-300';
      case 'Faculty': return 'bg-blue-500/10 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300';
      case 'Student': return 'bg-green-500/10 dark:bg-green-500/30 text-green-700 dark:text-green-300';
      default: return 'bg-stone-500/10 dark:bg-stone-500/30 text-stone-700 dark:text-stone-300';
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-heading">Admin - User Management</h1>
        <div className="flex items-center gap-2 bg-stone-200 dark:bg-stone-800 p-1 rounded-lg">
          {(['All', 'Student', 'Faculty'] as const).map(roleFilter => (
            <button key={roleFilter} onClick={() => setFilter(roleFilter as 'All' | Role)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === roleFilter ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-300/50 dark:hover:bg-stone-700/50'}`}>
              {roleFilter === 'Faculty' ? 'Teachers' : roleFilter === 'Student' ? 'Students' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-stone-800/50 border rounded-lg">
        <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
          <thead className="bg-stone-50 dark:bg-stone-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-stone-800/50 divide-y divide-stone-200 dark:divide-stone-700">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>{user.role}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(user.lastLogin).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${user.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-stone-500 dark:text-stone-500'}`}>{user.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => toggleStatus(user.id)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"> {user.status === 'Active' ? 'Deactivate' : 'Activate'} </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
