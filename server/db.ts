import fs from 'fs';
import path from 'path';
import { User, Expense } from '../src/types';

const DB_FILE = path.resolve(process.cwd(), 'data.json');

interface Schema {
  users: User[];
  expenses: Expense[];
}

class JSONDatabase {
  private data: Schema = { users: [], expenses: [] };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (error) {
      console.error('Error loading database, initializing empty', error);
      this.data = { users: [], expenses: [] };
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving database', error);
    }
  }

  // Users Collection
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }

  deleteUser(id: string) {
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.expenses = this.data.expenses.filter(e => e.userId !== id);
    this.save();
  }

  // Expenses Collection
  getExpenses(userId: string): Expense[] {
    return this.data.expenses.filter(e => e.userId === userId);
  }

  getExpenseById(id: string, userId: string): Expense | undefined {
    return this.data.expenses.find(e => e.id === id && e.userId === userId);
  }

  createExpense(expense: Expense): Expense {
    this.data.expenses.push(expense);
    this.save();
    return expense;
  }

  updateExpense(id: string, userId: string, updates: Partial<Expense>): Expense {
    const index = this.data.expenses.findIndex(e => e.id === id && e.userId === userId);
    if (index === -1) throw new Error('Expense not found');
    this.data.expenses[index] = { ...this.data.expenses[index], ...updates };
    this.save();
    return this.data.expenses[index];
  }

  deleteExpense(id: string, userId: string): boolean {
    const initialLength = this.data.expenses.length;
    this.data.expenses = this.data.expenses.filter(e => !(e.id === id && e.userId === userId));
    const deleted = this.data.expenses.length < initialLength;
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  wipeExpensesForUser(userId: string): void {
    this.data.expenses = this.data.expenses.filter(e => e.userId !== userId);
    this.save();
  }
}

export const db = new JSONDatabase();
