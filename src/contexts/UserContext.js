import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

// Custom hook for easy access to UserContext
export const useUser = () => useContext(UserContext);

// Provider to wrap your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize with null or a default value

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
