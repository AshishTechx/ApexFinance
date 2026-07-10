export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  currency: string;
  profileImage: string;
  createdAt: string;
  budgetLimit: number;
  budgets: Budget[];
  settings?: any;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  description: string;
  amount: number;
  category: string; // Food, Travel, Shopping, Medical, Education, Salary, Bills, Entertainment, Investment, Others
  paymentMethod: string; // Cash, UPI, Credit Card, Debit Card, Net Banking
  date: string; // YYYY-MM-DD
  notes: string;
  receiptImage?: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface AppSettings {
  darkMode: boolean;
  currency: string; // $, €, £, ₹, etc.
  language: string;
  notificationsEnabled: boolean;
}

export interface DashboardStats {
  totalExpenses: number;
  todayExpenses: number;
  thisMonthExpenses: number;
  thisYearExpenses: number;
  totalTransactions: number;
  averageDailySpending: number;
  averageMonthlySpending: number;
  highestExpense: { title: string; amount: number; date: string } | null;
  lowestExpense: { title: string; amount: number; date: string } | null;
  categorySpending: { name: string; value: number; color: string }[];
  monthlySpending: { month: string; amount: number }[];
  weeklySpending: { day: string; amount: number }[];
  recentTransactions: Expense[];
}

export type CategoryType =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Medical"
  | "Education"
  | "Salary"
  | "Bills"
  | "Entertainment"
  | "Investment"
  | "Others";

export type PaymentMethodType =
  | "Cash"
  | "UPI"
  | "Credit Card"
  | "Debit Card"
  | "Net Banking";
