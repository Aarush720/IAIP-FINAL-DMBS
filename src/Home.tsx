import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 to-stone-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to IAIP
        </h1>
        <p className="text-xl text-stone-300">
          Integrated Academic Insights Portal
        </p>
      </div>
    </div>
  );
};

export default Home;
