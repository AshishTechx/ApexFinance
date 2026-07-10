import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Expense } from '../../src/types';

const router = Router();

// POST /api/expenses - Create Expense
router.post('/', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const { title, description, amount, category, paymentMethod, date, notes, receiptImage } = req.body;

    if (!title || amount === undefined || !category || !paymentMethod || !date) {
      return res.status(400).json({ message: 'Title, amount, category, payment method, and date are required.' });
    }

    const newExpense: Expense = {
      id: Math.random().toString(36).substring(2, 11),
      userId: req.userId!,
      title,
      description: description || '',
      amount: Number(amount),
      category,
      paymentMethod,
      date, // YYYY-MM-DD
      notes: notes || '',
      receiptImage: receiptImage || '',
      createdAt: new Date().toISOString()
    };

    const savedExpense = db.createExpense(newExpense);
    return res.status(201).json({
      message: 'Expense added successfully',
      expense: savedExpense
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to create expense', error: error.message });
  }
});

// GET /api/expenses - List Expenses (with search, filter, sort, and pagination)
router.get('/', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const userId = req.userId!;
    let expenses = db.getExpenses(userId);

    // 1. Search Query
    const search = req.query.search as string;
    if (search) {
      const searchLower = search.toLowerCase();
      expenses = expenses.filter(e => 
        e.title.toLowerCase().includes(searchLower) ||
        (e.description && e.description.toLowerCase().includes(searchLower)) ||
        e.category.toLowerCase().includes(searchLower) ||
        e.paymentMethod.toLowerCase().includes(searchLower) ||
        (e.notes && e.notes.toLowerCase().includes(searchLower)) ||
        e.amount.toString().includes(searchLower) ||
        e.date.includes(searchLower)
      );
    }

    // 2. Date Filter
    const filter = req.query.filter as string; // 'today', 'yesterday', 'this-week', 'last-week', 'this-month', 'last-month', 'this-year', 'custom'
    const startDate = req.query.startDate as string; // YYYY-MM-DD
    const endDate = req.query.endDate as string; // YYYY-MM-DD

    const getTodayStr = () => new Date().toISOString().split('T')[0];
    const getYesterdayStr = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    };

    if (filter) {
      const today = new Date();
      if (filter === 'today') {
        const todayStr = getTodayStr();
        expenses = expenses.filter(e => e.date === todayStr);
      } else if (filter === 'yesterday') {
        const yesterdayStr = getYesterdayStr();
        expenses = expenses.filter(e => e.date === yesterdayStr);
      } else if (filter === 'this-week') {
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        startOfWeek.setHours(0,0,0,0);
        expenses = expenses.filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate >= startOfWeek && expenseDate <= today;
        });
      } else if (filter === 'last-week') {
        const startOfLastWeek = new Date();
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date();
        endOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
        startOfLastWeek.setHours(0,0,0,0);
        endOfLastWeek.setHours(23,59,59,999);
        expenses = expenses.filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate >= startOfLastWeek && expenseDate <= endOfLastWeek;
        });
      } else if (filter === 'this-month') {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const monthPrefix = `${year}-${month}`;
        expenses = expenses.filter(e => e.date.startsWith(monthPrefix));
      } else if (filter === 'last-month') {
        let prevYear = today.getFullYear();
        let prevMonthNum = today.getMonth() - 1;
        if (prevMonthNum < 0) {
          prevMonthNum = 11;
          prevYear -= 1;
        }
        const monthPrefix = `${prevYear}-${String(prevMonthNum + 1).padStart(2, '0')}`;
        expenses = expenses.filter(e => e.date.startsWith(monthPrefix));
      } else if (filter === 'this-year') {
        const yearStr = today.getFullYear().toString();
        expenses = expenses.filter(e => e.date.startsWith(yearStr));
      } else if (filter === 'custom' && startDate && endDate) {
        expenses = expenses.filter(e => e.date >= startDate && e.date <= endDate);
      }
    }

    // 3. Category Filter
    const category = req.query.category as string;
    if (category) {
      expenses = expenses.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    // 4. Payment Method Filter
    const paymentMethod = req.query.paymentMethod as string;
    if (paymentMethod) {
      expenses = expenses.filter(e => e.paymentMethod.toLowerCase() === paymentMethod.toLowerCase());
    }

    // 5. Sorting
    const sortBy = (req.query.sortBy as string) || 'newest'; // 'newest', 'oldest', 'highest', 'lowest', 'a-z', 'z-a'
    expenses.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
      } else if (sortBy === 'oldest') {
        return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
      } else if (sortBy === 'highest') {
        return b.amount - a.amount;
      } else if (sortBy === 'lowest') {
        return a.amount - b.amount;
      } else if (sortBy === 'a-z') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'z-a') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    // 6. Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const totalExpenses = expenses.length;
    const totalPages = Math.ceil(totalExpenses / limit);
    const startIndex = (page - 1) * limit;
    const paginatedExpenses = expenses.slice(startIndex, startIndex + limit);

    return res.json({
      expenses: paginatedExpenses,
      pagination: {
        total: totalExpenses,
        pages: totalPages,
        page,
        limit
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
});

// GET /api/expenses/:id - Fetch Individual Expense
router.get('/:id', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const expense = db.getExpenseById(req.params.id, req.userId!);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    return res.json(expense);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch expense details', error: error.message });
  }
});

// PUT /api/expenses/:id - Edit Expense
router.put('/:id', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const { title, description, amount, category, paymentMethod, date, notes, receiptImage } = req.body;
    const expense = db.getExpenseById(req.params.id, req.userId!);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const updated = db.updateExpense(req.params.id, req.userId!, {
      title: title !== undefined ? title : expense.title,
      description: description !== undefined ? description : expense.description,
      amount: amount !== undefined ? Number(amount) : expense.amount,
      category: category !== undefined ? category : expense.category,
      paymentMethod: paymentMethod !== undefined ? paymentMethod : expense.paymentMethod,
      date: date !== undefined ? date : expense.date,
      notes: notes !== undefined ? notes : expense.notes,
      receiptImage: receiptImage !== undefined ? receiptImage : expense.receiptImage
    });

    return res.json({
      message: 'Expense updated successfully',
      expense: updated
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update expense', error: error.message });
  }
});

// DELETE /api/expenses/purge/all - Purge all user expenses
router.delete('/purge/all', authMiddleware, (req: AuthRequest, res): any => {
  try {
    db.wipeExpensesForUser(req.userId!);
    return res.json({ message: 'All user expenses purged successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to purge user expenses', error: error.message });
  }
});

// DELETE /api/expenses/:id - Delete Expense
router.delete('/:id', authMiddleware, (req: AuthRequest, res): any => {
  try {
    const deleted = db.deleteExpense(req.params.id, req.userId!);
    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
    return res.json({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
});

export default router;
