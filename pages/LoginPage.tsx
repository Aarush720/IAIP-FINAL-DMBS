import React, { useState } from 'react';
import { useAuth, Role } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Role>('Student');
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setEmail(`${role.toLowerCase()}@university.edu`);
    setPassword('password');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const TabButton: React.FC<{ role: Role }> = ({ role }) => (
    <button
      type="button"
      onClick={() => handleTabChange(role)}
      className={`w-1/3 py-3 text-sm font-bold transition-colors duration-300 focus:outline-none ${
        activeTab === role
          ? 'text-stone-800 dark:text-[#FAF4F4] border-b-2 border-[#CF5256]'
          : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
      }`}
    >
      {role}
    </button>
  );

  return (
    <div className="min-h-screen text-stone-900 dark:text-[#FAF4F4] flex items-center justify-center p-4 animate-login-fade-in">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-stone-900 dark:text-[#FAF4F4]">
              IAI <span className="text-[#CF5256]">Portal</span>
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mt-2">Sign in to access your dashboard</p>
        </div>

        <div className="bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
          <div className="flex">
            <TabButton role="Student" />
            <TabButton role="Faculty" />
            <TabButton role="Admin" />
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#CF5256] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password"className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#CF5256] sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-[#CF5256] hover:text-rose-400">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#CF5256] hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-100 dark:focus:ring-offset-stone-900 focus:ring-[#CF5256] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : `Sign in as ${activeTab}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
