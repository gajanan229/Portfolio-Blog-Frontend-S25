import { useState, useEffect } from 'react';
import type { User } from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/current-user`, {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Mock user for development - keeping this for now
      // setUser({ id: '1', email: 'gajanan@example.com', isadmin: true });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (response.ok) {
        await checkCurrentUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/logout`, { 
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (response.ok) {
        // After successful registration, directly log in the user
        // by calling login(), which will then call checkCurrentUser()
        return await login(email, password);
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  return { user, loading, login, logout, register };
};