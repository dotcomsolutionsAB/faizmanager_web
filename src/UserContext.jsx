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
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [hofCount, setHofCount] = useState(0);

  useEffect(() => {
    // console.log('useEffect triggered in UserContext');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    const storedCurrency = JSON.parse(localStorage.getItem('currency'));
    const storedJamiatId = localStorage.getItem('jamiat_id');
    const storedRole = localStorage.getItem('role');
    const storedPermissions = JSON.parse(localStorage.getItem('permissions'));
    const storedHofCount = localStorage.getItem('hof_count');
  
    console.log(localStorage.getItem("token"))
    // console.log('Stored User:', storedUser);
    // console.log('Stored Token:', storedToken);
    // console.log("stored hof count:", storedHofCount);

    // console.log("Role in user context: stored role", storedRole);

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
    }if (storedRole) {
      setRole(storedRole);
    }
    if (storedPermissions) {
      setPermissions(storedPermissions);
    }
   if (storedHofCount !== null && storedHofCount !== undefined) {
    setHofCount(Number(storedHofCount));
}
    console.log("Role in user context: stored role", storedRole);

    setLoading(false);
    // console.log("Sending token to MumeneenTable : ", token);
  }, [token]);
  

  const updateUser = (newUser, newToken, newCurrency, newJamiatId, newRole, newPermissions, newHofCount) => {
    setUser(newUser);
    setToken(newToken);
    setCurrency(newCurrency); 
    setJamiatId(newJamiatId);
    setRole(newRole);
    setPermissions(newPermissions);
    setHofCount(newHofCount);
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
    if (newRole) {
      localStorage.setItem('role', newRole);
    } else {
      localStorage.removeItem('role');
    }
    if (newPermissions) {
      localStorage.setItem('permissions', JSON.stringify(newPermissions));
    } else {
      localStorage.removeItem('permissions');
    }
    if (newHofCount !== null && newHofCount !== undefined) {
      localStorage.setItem('hof_count', newHofCount);
      setHofCount(Number(newHofCount)); // Ensure hofCount is a number
    } else {
      localStorage.removeItem('hof_count');
      setHofCount(null);
    }
    
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrency(null);
    setJamiatId(null); 
    setRole(null);
    setPermissions([]);
    setHofCount(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('currency'); 
    localStorage.removeItem('jamiat_id'); 
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');
    localStorage.removeItem('hof_count');
  };


  return (
    <UserContext.Provider value={{ user, token, currency, jamiatId,   role,
      permissions,
      hofCount, updateUser, logout }}>
      {loading ? null : children}
    </UserContext.Provider>
  );
}

export default UserContext;
