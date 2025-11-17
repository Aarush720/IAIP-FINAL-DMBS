import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to IAIP</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-stone-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">Academic Performance</h2>
          <p className="text-stone-300">Track your academic progress</p>
        </div>
        <div className="bg-stone-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">Student Insights</h2>
          <p className="text-stone-300">Get insights into your performance</p>
        </div>
        <div className="bg-stone-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">Analytics</h2>
          <p className="text-stone-300">View detailed analytics</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
