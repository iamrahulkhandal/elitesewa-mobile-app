// HeaderTitleContext.js
import React, { createContext, useContext, useState } from 'react';

// Create Context
export const HeaderTitleContext = createContext();

// Create Provider component
export const HeaderTitleProvider = ({ children }) => {
  const [headerTitle, setHeaderTitle] = useState('Home');

  const updateHeaderTitle = (title) => {
    setHeaderTitle(title);
  };

  return (
    <HeaderTitleContext.Provider value={{ headerTitle, updateHeaderTitle }}>
      {children}
    </HeaderTitleContext.Provider>
  );
};

// Custom Hook to use context in child components
export const useHeaderTitle = () => useContext(HeaderTitleContext);
