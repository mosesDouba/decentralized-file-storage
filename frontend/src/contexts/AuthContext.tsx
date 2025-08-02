import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, TokenManager } from '@/services/api';
import type { User, AuthContextType } from '@/types/file';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = TokenManager.getToken();
    if (savedToken) {
      setToken(savedToken);
      // Verify token and get user info
      apiService.getCurrentUser()
        .then((userData) => {
          setUser({
            id: userData.id,
            username: userData.username,
            role: userData.role,
            isAdmin: userData.role === 'admin'
          });
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          TokenManager.removeToken();
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.login(username, password);
      
      TokenManager.setToken(response.token);
      setToken(response.token);
      setUser({
        id: response.user.id,
        username: response.user.username,
        role: response.user.role,
        isAdmin: response.user.role === 'admin'
      });

      toast({
        title: "Success",
        description: `Welcome back, ${response.user.username}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.register(username, password);
      
      toast({
        title: "Registration Successful",
        description: `Account created for ${response.user.username}. Please log in.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    TokenManager.removeToken();
    setToken(null);
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 