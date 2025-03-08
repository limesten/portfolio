import { useState, useEffect } from 'react';

// Custom hook for managing a counter with localStorage persistence
const usePersistedCounter = (key: string, initialValue: number = 0) => {
  // Initialize state from localStorage or use initial value
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored) : initialValue;
  });

  // Update localStorage when count changes
  useEffect(() => {
    localStorage.setItem(key, count.toString());
  }, [key, count]);

  // Return count and methods to update it
  return {
    count,
    increment: () => setCount(prev => prev + 1),
    decrement: () => setCount(prev => prev - 1),
    reset: () => setCount(initialValue)
  };
}; 