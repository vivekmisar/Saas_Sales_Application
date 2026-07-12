import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount.
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await authApi.checkStatus();
      if (res.data.isAuthenticated) {
        setUser(res.data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.data.user);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authApi.register(data);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
