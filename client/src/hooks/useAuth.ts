import { useState, useEffect } from 'react';
import { User, useAppContext } from '../App';

export function useAuth() {
  const { user, setUser } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [setUser]);

  const login = (email: string, password: string): Promise<User> => {
    // Simulate login - in production would use Firebase Auth or similar
    return new Promise((resolve, reject) => {
      if (!email || !password) {
        reject(new Error('Please fill in all fields'));
        return;
      }

      // Mock successful login with delay
      setTimeout(() => {
        const newUser = { 
          email, 
          id: 'user_' + Math.random().toString(36).substring(2, 9),
          active: true 
        };
        
        // Update global state and local storage
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve(newUser);
      }, 500);
    });
  };

  const register = (email: string, password: string, confirmPassword: string, ageConfirm: boolean): Promise<User> => {
    return new Promise((resolve, reject) => {
      if (!email || !password) {
        reject(new Error('Please fill in all fields'));
        return;
      }

      if (password !== confirmPassword) {
        reject(new Error('Passwords do not match'));
        return;
      }
      
      if (!ageConfirm) {
        reject(new Error('You must confirm you are 18+ to continue'));
        return;
      }

      // Mock successful registration with delay
      setTimeout(() => {
        const newUser = { 
          email, 
          id: 'user_' + Math.random().toString(36).substring(2, 9),
          active: false 
        };
        
        // Update global state and local storage
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve(newUser);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserSubscription = () => {
    if (user) {
      const updatedUser = { ...user, active: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateUserSubscription,
    isAuthenticated: !!user,
    isSubscribed: user?.active || false
  };
} 