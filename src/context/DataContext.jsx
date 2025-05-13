import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Load initial data from localStorage
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('healthEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('healthGoals');
    return savedGoals ? JSON.parse(savedGoals) : {};
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('healthEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('healthGoals', JSON.stringify(goals));
  }, [goals]);

  return (
    <DataContext.Provider value={{ entries, setEntries, goals, setGoals }}>
      {children}
    </DataContext.Provider>
  );
}; 