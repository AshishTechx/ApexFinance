import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Expense, AppSettings, DashboardStats } from '../types';

interface AppContextType {
  token: string | null;
  user: User | null;
  settings: AppSettings;
  loading: boolean;
  activeView: string; // 'landing' | 'dashboard' | 'expenses' | 'reports' | 'profile' | 'settings' | 'login' | 'register'
  stats: DashboardStats | null;
  expenses: Expense[];
  toast: { message: string; type: 'success' | 'error' | 'info' | null };
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  login: (token: string, user: any) => void;
  logout: () => void;
  setRoute: (view: string) => void;
  refreshUserData: () => Promise<void>;
  updateProfile: (data: Partial<User & { budgetLimit: number; budgets: any[] }>) => Promise<boolean>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  fetchExpenses: (params?: any) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  addExpense: (data: Partial<Expense>) => Promise<boolean>;
  editExpense: (id: string, data: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('landing');
  const [loading, setLoading] = useState<boolean>(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: true,
    currency: '$',
    language: 'English',
    notificationsEnabled: true
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({
    message: '',
    type: null
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast({ message: '', type: null });
  };

  // Set active route/view
  const setRoute = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  const login = (newToken: string, newUser: any) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    setSettings(prev => ({ ...prev, currency: newUser.currency || '$' }));
    showToast(`Welcome back, ${newUser.name}!`, 'success');
    setRoute('dashboard');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setExpenses([]);
    setStats(null);
    showToast('Logged out successfully', 'success');
    setRoute('landing');
  };

  // API Call Wrapper
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(endpoint, { ...options, headers });
      if (res.status === 401) {
        // Token expired/invalid
        logout();
        throw new Error('Session expired. Please log in again.');
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      return data;
    } catch (err: any) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  };

  // Refresh user profile
  const refreshUserData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiCall('/api/auth/profile');
      setUser(data);
      setSettings(prev => ({
        ...prev,
        currency: data.currency || '$'
      }));
    } catch (err: any) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (data: Partial<User & { budgetLimit: number; budgets: any[] }>) => {
    try {
      const updatedUser = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      setUser(updatedUser);
      setSettings(prev => ({
        ...prev,
        currency: updatedUser.currency || '$'
      }));
      showToast('Profile updated successfully', 'success');
      // Refresh dashboard stats too as currency or budgets may change
      await fetchDashboardStats();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
      return false;
    }
  };

  // Change Password
  const changePassword = async (currentPass: string, newPassword: string) => {
    try {
      await apiCall('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: currentPass, newPassword })
      });
      showToast('Password updated successfully', 'success');
      return { success: true };
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
      return { success: false, error: err.message };
    }
  };

  // Fetch all expenses
  const fetchExpenses = async (params: any = {}) => {
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          query.append(key, params[key]);
        }
      });
      const data = await apiCall(`/api/expenses?${query.toString()}`);
      setExpenses(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load expenses', 'error');
    }
  };

  // Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    try {
      const data = await apiCall('/api/dashboard');
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load dashboard stats', err);
    }
  };

  // Add Expense
  const addExpense = async (data: Partial<Expense>) => {
    try {
      await apiCall('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      showToast('Expense recorded successfully!', 'success');
      await fetchExpenses();
      await fetchDashboardStats();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to record expense', 'error');
      return false;
    }
  };

  // Edit Expense
  const editExpense = async (id: string, data: Partial<Expense>) => {
    try {
      await apiCall(`/api/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      showToast('Expense updated successfully!', 'success');
      await fetchExpenses();
      await fetchDashboardStats();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update expense', 'error');
      return false;
    }
  };

  // Delete Expense
  const deleteExpense = async (id: string) => {
    try {
      await apiCall(`/api/expenses/${id}`, {
        method: 'DELETE'
      });
      showToast('Expense deleted successfully', 'success');
      await fetchExpenses();
      await fetchDashboardStats();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to delete expense', 'error');
      return false;
    }
  };

  // On mount check token
  useEffect(() => {
    if (token) {
      refreshUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Sync state data
  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchDashboardStats();
    }
  }, [user]);

  // Auto hide toast after 4s
  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        settings,
        loading,
        activeView,
        stats,
        expenses,
        toast,
        showToast,
        hideToast,
        login,
        logout,
        setRoute,
        refreshUserData,
        updateProfile,
        changePassword,
        fetchExpenses,
        fetchDashboardStats,
        addExpense,
        editExpense,
        deleteExpense
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
