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
    <div className=' bg-[#f4f3ef]'>

    <nav className="flex items-center space-x-2 text-sm py-2 px-6 w-full lg:w-[93.5%] mx-auto">
      <button
        onClick={handleHomeClick}
        className="text-[#9a9792] transition-colors cursor-pointer"
      >
        Home
      </button>
      <svg 
              stroke="currentColor" 
              color="#9a9792"
              fill="currentColor" 
              strokeWidth="0" 
              viewBox="0 0 512 512" 
              height="1em" 
              width="1em" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
      <span className="text-[#696661] font-medium cursor-default">
        {label}
      </span>
    </nav>
    </div>
    </>
  );
};

export default Breadcrumb;