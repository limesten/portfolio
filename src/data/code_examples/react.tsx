import { useState, useEffect } from 'react';

const usePersistedCounter = (key: string, initialValue: number = 0) => {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, count.toString());
  }, [key, count]);

  return {
    count,
    increment: () => setCount(prev => prev + 1),
    decrement: () => setCount(prev => prev - 1),
    reset: () => setCount(initialValue)
  };
}; 