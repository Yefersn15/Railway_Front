import React, { createContext, useState, useContext, useEffect } from 'react';

const LayoutContext = createContext();

const STORAGE_KEY = 'layoutMode';
const COLLAPSED_STORAGE_KEY = 'sidebarCollapsed';

export const LayoutProvider = ({ children }) => {
  const [layoutMode, setLayoutModeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'header';
  });

  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() => {
    return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, sidebarCollapsed);
  }, [sidebarCollapsed]);

  const setLayoutMode = (mode) => {
    if (mode === 'header' || mode === 'sidebar') {
      setLayoutModeState(mode);
    }
  };

  const toggleLayoutMode = () => {
    setLayoutModeState((prev) => (prev === 'header' ? 'sidebar' : 'header'));
  };

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsedState((prev) => !prev);
  };

  const value = {
    layoutMode,
    setLayoutMode,
    toggleLayoutMode,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout debe ser usado dentro de un LayoutProvider');
  }
  return context;
};

export default LayoutContext;
