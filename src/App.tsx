import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { ToastProvider } from './components/Toast';
import AppLayout from './layouts/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Loading Screen
function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center space-y-4 font-sans select-none">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 border-r-2 border-r-transparent"></div>
      </div>
      <p className="text-[10px] text-slate-500 font-bold font-mono tracking-widest uppercase">INITIALIZING_APEX_VAULTS...</p>
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <GlobalLoading />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

// Anonymous Route Guard (Redirects logged-in users away from auth pages)
function AnonymousRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <GlobalLoading />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function MainAppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <GlobalLoading />;
  }

  return (
    <Routes>
      {/* Public Landing Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Public Routes */}
      <Route 
        path="/login" 
        element={
          <AnonymousRoute>
            <LoginPage />
          </AnonymousRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AnonymousRoute>
            <RegisterPage />
          </AnonymousRoute>
        } 
      />

      {/* Protected App Routes wrapped in Layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/expenses" 
        element={
          <ProtectedRoute>
            <ExpensesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ExpenseProvider>
            <MainAppRoutes />
          </ExpenseProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
