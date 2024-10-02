import React, { createContext, useState, useContext } from 'react';

const DateFormatContext = createContext();

export const DateFormatProvider = ({ children }) => {
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy'); // default format

  return (
    <DateFormatContext.Provider value={{ dateFormat, setDateFormat }}>
      {children}
    </DateFormatContext.Provider>
  );
};

export const useDateFormat = () => useContext(DateFormatContext); 
