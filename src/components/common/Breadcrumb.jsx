import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const Breadcrumb = ({ label }) => {
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <>
    {/* <Loader/> */}

    <nav className="flex items-center space-x-2 text-sm py-4 px-6">
      <button
        onClick={handleHomeClick}
        className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      >
        Home
      </button>
      <span className="text-gray-400">›</span>
      <span className="text-gray-900 font-medium cursor-default">
        {label}
      </span>
    </nav>
    </>
  );
};

export default Breadcrumb;