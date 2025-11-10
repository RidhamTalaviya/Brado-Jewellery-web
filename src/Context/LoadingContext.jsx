import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isform, setIsForm] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading , isform, setIsForm }}>
      {children}
    </LoadingContext.Provider>
  );
};