import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect triggered in UserContext');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
  
    console.log('Stored User:', storedUser);
    console.log('Stored Token:', storedToken);

    if (storedUser) {
      setUser(storedUser);
    }
    if (storedToken) {
      setToken(storedToken);
    } else if (storedUser?.token) {
      setToken(storedUser.token);
      localStorage.setItem('token', storedUser.token); // Save token in localStorage
    }
    setLoading(false);
    console.log("Sending token to MumeneenTable : ", token);
  }, [token]);
  

  const updateUser = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };


  return (
    <UserContext.Provider value={{ user, token, updateUser, logout }}>
      {loading ? null : children}
    </UserContext.Provider>
  );
}

export default UserContext;
