import React, { createContext, useContext, useState } from 'react';
import { Expense, DashboardStats } from '../types';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
  expenses: Expense[];
  stats: DashboardStats | null;
  loading: boolean;
  pagination: { total: number; pages: number; page: number; limit: number };
  fetchExpenses: (query?: Record<string, any>) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  editExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getExpense: (id: string) => Promise<Expense>;
  wipeExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { token, refreshProfile } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 10 });

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const res = await fetch(`${window.location.origin}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  };

  const fetchExpenses = async (query: Record<string, any> = {}) => {
    if (!token) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          queryParams.append(key, String(val));
        }
      });

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await apiFetch(`/api/expenses${queryString}`);
      setExpenses(data.expenses);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await apiFetch('/api/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    await apiFetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    });
    // Refresh stats and expenses
    await fetchDashboardStats();
    await fetchExpenses({ page: 1 });
    await refreshProfile(); // Refresh budget indicator or currency change
  };

  const editExpense = async (id: string, updates: Partial<Expense>) => {
    await apiFetch(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    await fetchDashboardStats();
    await fetchExpenses({ page: pagination.page });
    await refreshProfile();
  };

  const deleteExpense = async (id: string) => {
    await apiFetch(`/api/expenses/${id}`, {
      method: 'DELETE'
    });
    await fetchDashboardStats();
    await fetchExpenses({ page: 1 });
    await refreshProfile();
  };

  const getExpense = async (id: string): Promise<Expense> => {
    return await apiFetch(`/api/expenses/${id}`);
  };

  const wipeExpenses = async () => {
    await apiFetch('/api/expenses/purge/all', {
      method: 'DELETE'
    });
    await fetchDashboardStats();
    await fetchExpenses({ page: 1 });
    await refreshProfile();
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      stats,
      loading,
      pagination,
      fetchExpenses,
      fetchDashboardStats,
      addExpense,
      editExpense,
      deleteExpense,
      getExpense,
      wipeExpenses
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
