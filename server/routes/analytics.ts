import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Expense } from '../../src/types';

const router = Router();

// Help format dates
const getTodayStr = () => new Date().toISOString().split('T')[0];

const getMonthPrefix = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10B981', // Emerald
  Travel: '#3B82F6', // Blue
  Shopping: '#F59E0B', // Amber
  Medical: '#EF4444', // Red
  Education: '#8B5CF6', // Purple
  Salary: '#06B6D4', // Cyan (Wait, Salary usually represents income, but can be category)
  Bills: '#EC4899', // Pink
  Entertainment: '#F43F5E', // Rose
  Investment: '#6366F1', // Indigo
  Others: '#6B7280', // Gray
};

// GET /api/dashboard - Get overall overview dashboard metrics
router.get('/', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const userId = req.userId!;
    const expenses = db.getExpenses(userId);

    const todayStr = getTodayStr();
    const today = new Date();
    const currentMonthPrefix = getMonthPrefix(today);
    const currentYearStr = today.getFullYear().toString();

    // 1. Core aggregates
    let totalExpenses = 0;
    let todayExpenses = 0;
    let thisMonthExpenses = 0;
    let thisYearExpenses = 0;
    const totalTransactions = expenses.length;

    let highestExpense: Expense | null = null;
    let lowestExpense: Expense | null = null;

    // Track expenses by day of current month for average daily calculations
    const daysWithExpenses = new Set<string>();

    expenses.forEach(e => {
      const amt = Number(e.amount);
      totalExpenses += amt;
      daysWithExpenses.add(e.date);

      if (e.date === todayStr) {
        todayExpenses += amt;
      }
      if (e.date.startsWith(currentMonthPrefix)) {
        thisMonthExpenses += amt;
      }
      if (e.date.startsWith(currentYearStr)) {
        thisYearExpenses += amt;
      }

      // Highest / Lowest
      if (!highestExpense || amt > highestExpense.amount) {
        highestExpense = e;
      }
      if (!lowestExpense || amt < lowestExpense.amount) {
        lowestExpense = e;
      }
    });

    // 2. Average daily spending in the current month
    // Let's find days elapsed in current month or total days in database
    const daysInCurrentMonth = today.getDate(); // e.g. 10 if today is July 10
    const averageDailySpending = daysInCurrentMonth > 0 ? (thisMonthExpenses / daysInCurrentMonth) : 0;

    // 3. Average monthly spending in the current year
    const monthsElapsed = today.getMonth() + 1; // 1-12
    const averageMonthlySpending = monthsElapsed > 0 ? (thisYearExpenses / monthsElapsed) : 0;

    // 4. Recent transactions (latest 5)
    const recentTransactions = [...expenses]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);

    // 5. Category-wise breakdown (for Pie Chart)
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
      const cat = e.category || 'Others';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
    });

    const categorySpending = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#6B7280'
    })).sort((a, b) => b.value - a.value);

    // 6. Monthly spending (last 6 months in current year/prev year)
    const monthlyTotals: Record<string, number> = {};
    const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(today.getMonth() - i);
      const key = getMonthPrefix(d);
      const label = `${monthsName[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      monthlyTotals[key] = 0;
    }

    expenses.forEach(e => {
      const expenseMonth = e.date.substring(0, 7); // YYYY-MM
      if (monthlyTotals[expenseMonth] !== undefined) {
        monthlyTotals[expenseMonth] += Number(e.amount);
      }
    });

    const monthlySpending = Object.entries(monthlyTotals).map(([key, amount]) => {
      const parts = key.split('-');
      const mIdx = parseInt(parts[1]) - 1;
      const yr = parts[0].substring(2);
      return {
        month: `${monthsName[mIdx]} '${yr}`,
        amount
      };
    });

    // 7. Weekly spending (last 7 days)
    const weeklyTotals: Record<string, number> = {};
    const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      weeklyTotals[key] = 0;
    }

    expenses.forEach(e => {
      if (weeklyTotals[e.date] !== undefined) {
        weeklyTotals[e.date] += Number(e.amount);
      }
    });

    const weeklySpending = Object.entries(weeklyTotals).map(([key, amount]) => {
      const d = new Date(key);
      const dayLabel = daysName[d.getDay()];
      return {
        day: dayLabel,
        amount
      };
    });

    return res.json({
      totalExpenses,
      todayExpenses,
      thisMonthExpenses,
      thisYearExpenses,
      totalTransactions,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      averageMonthlySpending: Math.round(averageMonthlySpending * 100) / 100,
      highestExpense: highestExpense ? { title: (highestExpense as Expense).title, amount: (highestExpense as Expense).amount, date: (highestExpense as Expense).date } : null,
      lowestExpense: lowestExpense ? { title: (lowestExpense as Expense).title, amount: (lowestExpense as Expense).amount, date: (lowestExpense as Expense).date } : null,
      categorySpending,
      monthlySpending,
      weeklySpending,
      recentTransactions
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to generate dashboard statistics', error: error.message });
  }
});

// GET /api/dashboard/monthly - Return full monthly comparison stats
router.get('/monthly', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const userId = req.userId!;
    const expenses = db.getExpenses(userId);

    const monthlyMap: Record<string, number> = {};
    const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    expenses.forEach(e => {
      const monthPrefix = e.date.substring(0, 7); // YYYY-MM
      monthlyMap[monthPrefix] = (monthlyMap[monthPrefix] || 0) + Number(e.amount);
    });

    const monthlyComparison = Object.entries(monthlyMap)
      .map(([key, amount]) => {
        const [yr, mo] = key.split('-');
        const monthLabel = `${monthsName[parseInt(mo) - 1]} ${yr}`;
        return {
          key,
          month: monthLabel,
          amount
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key));

    return res.json(monthlyComparison);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to generate monthly comparison', error: error.message });
  }
});

// GET /api/dashboard/category - Return detailed category breakdown
router.get('/category', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const userId = req.userId!;
    const expenses = db.getExpenses(userId);

    const categoryTotals: Record<string, { total: number; count: number }> = {};
    expenses.forEach(e => {
      const cat = e.category || 'Others';
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { total: 0, count: 0 };
      }
      categoryTotals[cat].total += Number(e.amount);
      categoryTotals[cat].count += 1;
    });

    const breakdown = Object.entries(categoryTotals).map(([name, stats]) => ({
      category: name,
      total: stats.total,
      count: stats.count,
      color: CATEGORY_COLORS[name] || '#6B7280'
    })).sort((a, b) => b.total - a.total);

    return res.json(breakdown);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to generate category stats', error: error.message });
  }
});

// GET /api/dashboard/payment - Return payment method breakdown
router.get('/payment', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const userId = req.userId!;
    const expenses = db.getExpenses(userId);

    const paymentTotals: Record<string, { total: number; count: number }> = {};
    expenses.forEach(e => {
      const method = e.paymentMethod || 'Cash';
      if (!paymentTotals[method]) {
        paymentTotals[method] = { total: 0, count: 0 };
      }
      paymentTotals[method].total += Number(e.amount);
      paymentTotals[method].count += 1;
    });

    const colors: Record<string, string> = {
      'Cash': '#10B981', // Emerald
      'UPI': '#3B82F6', // Blue
      'Credit Card': '#EF4444', // Red
      'Debit Card': '#F59E0B', // Amber
      'Net Banking': '#8B5CF6' // Purple
    };

    const breakdown = Object.entries(paymentTotals).map(([name, stats]) => ({
      method: name,
      total: stats.total,
      count: stats.count,
      color: colors[name] || '#6B7280'
    })).sort((a, b) => b.total - a.total);

    return res.json(breakdown);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to generate payment method stats', error: error.message });
  }
});

export default router;
