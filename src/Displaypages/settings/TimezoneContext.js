// TimezoneContext.js
import React from 'react';

const TimezoneContext = React.createContext();

export const TimezoneProvider = ({ children, value }) => (
  <TimezoneContext.Provider value={value}>
    {children}
  </TimezoneContext.Provider>
);

export const useTimezone = () => React.useContext(TimezoneContext);