// hooks/use-auth.tsx

import { useState, useEffect, createContext, useContext } from 'react';

// Define the AuthContext type
interface AuthContextType {
  user: any;
  login: (name : string) => void; //Added a variable
  logout: () => void;
  loading: boolean;
}

// Create a default context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: (name) => {}, //default function
  logout: () => {},
  loading: false,
});

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({name : "CurrentUser"});  //Change this variable here, set to static.
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    // Simulate checking for an existing user (e.g., from localStorage)
    // For now, set loading to false immediately
    setLoading(false);
  }, []);

  const login = (name:string) => {
    // Mock login: set a dummy user
    setUser({ name : name });
  };

  const logout = () => {
    // Mock logout: set user to null
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}