import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center w-full">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Alpha Prompt Generator Tool
      </h1>
      <p className="mt-2 text-base sm:text-lg text-slate-300">
        Your AI Prompt Engineering Co-Pilot
      </p>
    </header>
  );
};