import React, { createContext, useContext, useState, type ReactNode } from 'react';

type HeaderTitleContextValue = {
  headerTitle: string;
  updateHeaderTitle: (title: string) => void;
};

/**
 * The default is a working no-op rather than `undefined`. Consumers destructure
 * this value straight away, so an undefined default would turn any render
 * outside the provider into a TypeError instead of a missing title.
 */
const defaultValue: HeaderTitleContextValue = {
  headerTitle: 'Home',
  updateHeaderTitle: () => {},
};

export const HeaderTitleContext = createContext<HeaderTitleContextValue>(defaultValue);

export const HeaderTitleProvider = ({ children }: { children: ReactNode }) => {
  const [headerTitle, setHeaderTitle] = useState('Home');

  const updateHeaderTitle = (title: string) => {
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
