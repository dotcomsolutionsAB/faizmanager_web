import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(null); 
  const [jamiatId, setJamiatId] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered in UserContext');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    const storedCurrency = JSON.parse(localStorage.getItem('currency'));
    const storedJamiatId = localStorage.getItem('jamiat_id');
  
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
    if (storedCurrency) {
      setCurrency(storedCurrency); // Set currency if it exists in localStorage
    }
    if (storedJamiatId) {
      setJamiatId(storedJamiatId); // Set jamiat_id if it exists in localStorage
    }
    setLoading(false);
    console.log("Sending token to MumeneenTable : ", token);
  }, [token]);
  

  const updateUser = (newUser, newToken, newCurrency, newJamiatId) => {
    setUser(newUser);
    setToken(newToken);
    setCurrency(newCurrency); 
    setJamiatId(newJamiatId);
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
    if (newCurrency) {
      localStorage.setItem('currency', JSON.stringify(newCurrency)); // Save currency in localStorage
    } else {
      localStorage.removeItem('currency');
    }
    if (newJamiatId) {
      localStorage.setItem('jamiat_id', newJamiatId); // Save jamiat_id in localStorage
    } else {
      localStorage.removeItem('jamiat_id');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrency(null);
    setJamiatId(null); 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('currency'); 
    localStorage.removeItem('jamiat_id'); 
  };


  return (
    <UserContext.Provider value={{ user, token, currency, jamiatId, updateUser, logout }}>
      {loading ? null : children}
    </UserContext.Provider>
  );
}

export default UserContext;
