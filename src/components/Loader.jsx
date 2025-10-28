import React from 'react';
import { useLoading } from '../Context/LoadingContext';

const Loader = () => {
  const { loading } = useLoading();

  // Only render when loading is true
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-1  z-50 overflow-hidden">
      <div className="h-full bg-[#b4853e] animate-[loadBar_1.5s_ease-in-out_infinite]"></div>
      <style>{`
        @keyframes loadBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Loader;