import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = auth.getUser();
    setUser(u);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const u = await auth.login(username, password);
    setUser(u);
    return u;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';
  const isStaff = !isClient; // admin, mechanic, painter, receptionist

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isClient, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
