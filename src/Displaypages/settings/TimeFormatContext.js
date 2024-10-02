// TimeFormatContext.js
import React, { createContext, useState, useContext } from 'react';

const TimeFormatContext = createContext();

export const TimeFormatProvider = ({ children }) => {
  const [timeFormat, setTimeFormat] = useState('');

  return (
    <TimeFormatContext.Provider value={{ timeFormat, setTimeFormat }}>
      {children}
    </TimeFormatContext.Provider>
  );
};

export const useTimeFormat = () => useContext(TimeFormatContext);