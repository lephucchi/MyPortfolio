import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  role: string | null;
  name: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [name, setName] = useState<string | null>(localStorage.getItem('name'));

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { access_token, role, name } = response.data;
      setToken(access_token);
      setRole(role);
      setName(name);
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setName(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  };

  return (
    <AuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};