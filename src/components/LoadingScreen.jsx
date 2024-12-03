import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <FaSpinner className="animate-spin w-8 h-8" />
      <div className="text-xl">Loading...</div>
    </div>
  );
};

export default LoadingScreen;