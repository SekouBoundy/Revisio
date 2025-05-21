import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  signIn: async () => {},
  signOut: async () => {},
  isLoggedIn: false,
  isLoading: true,
  user: null
});

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  // Simplified auth that always returns logged in for development
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Simplified auth functions that do nothing
  const signIn = async () => true;
  const signOut = async () => true;
  const auth = {
    signIn,
    signOut,
    isLoggedIn: true, // Always return logged in
    isLoading,
    user: { // Provide a mock user
      name: 'Demo User',
      email: 'demo@example.com',
      studentType: 'BAC'
    }
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider, useAuth };

