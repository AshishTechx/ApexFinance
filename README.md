# ApexFinance – Personal Expense Tracker & Smart Finance Manager

ApexFinance is a modern, premium, secure personal expense manager designed like a commercial Fintech SaaS product. Track spends on the fly, set category limits, configure budgets, visualize spending patterns via beautiful Recharts charts, and export PDF or CSV financial statements instantly.

## 🚀 Live Visual & Functional Overview

- **SaaS Marketing Website**: Polished landing page featuring hero metrics, interactive mockup widgets, visual 4-step workflow layouts, collapsible FAQs, and direct message contact forms. No floating chatbot popups are installed.
- **Unified Analytics Dashboard**: Overview of total, monthly, and daily spends. Gauges the highest log expense, historical spends, and alerts users dynamically if they cross overall or category-specific targets.
- **Advanced Registry Controls**: Search past spends instantly. Filter by category, payment mode (Cash, UPI, Cards, Net Banking), or date intervals (Today, Yesterday, This Week, Last Week, This Month, Last Year, Custom Range) with on-the-fly pagination.
- **Statements Compilation**: Print custom statements with a clean print-optimized layout stylesheet, or trigger client-side CSV spreadsheet downloads.
- **Profile & Settings Command**: Change preferred currency symbols, edit basic details, configure category-specific thresholds, update account passwords, or destroy records.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **React.js (v19)**: Single-page application rendering, custom state management.
- **Tailwind CSS (v4)**: High-contrast Slate & Emerald dark design language.
- **Lucide Icons**: Crisp, vector visual assets.
- **Recharts**: High-fidelity Area, Bar, and Pie visualizations.
- **Vite & TypeScript**: Lightning-fast compilations and strict type-safety.

### Backend
- **Node.js & Express**: Secure API router and static file hosting.
- **JSON Database**: Concurrent-safe JSON database file storage (`db.json`) enabling session and data persistence across server reloads.
- **JWT Cryptography**: Signed JSON Web Tokens protecting private resources.
- **PBKDF2 Password Hashing**: Native `crypto` key derivation pbkdf2Sync hashing protecting passwords.

---

## 📁 Project Directory Layout

```text
/
├── .env.example        # Reference environment keys (Secrets + URLs)
├── package.json        # Dependencies & building scripts
├── server.ts           # Fullstack backend server (Vite middleware + Express API)
├── db.json             # Flat-file database store (autosynced)
├── index.html          # Shell entry point
├── src/
│   ├── main.tsx        # App bootstrapper
│   ├── index.css       # Core Tailwind imports
│   ├── types.ts        # Typed system interfaces
│   ├── App.tsx         # Main router, structural frames, and toast notifications
│   ├── context/
│   │   └── AppContext.tsx   # Global authentication, settings, and CRUD wrappers
│   └── components/
│       ├── LandingPage.tsx   # Public marketing page (No chatbot elements!)
│       ├── AuthPages.tsx     # Secure Login & Registration views
│       ├── Dashboard.tsx     # Widgets, charts, budget alert progress bars
│       ├── ExpensesPage.tsx  # CRUD forms, registry grid tables, filters, pagination
│       ├── ReportsPage.tsx   # Print stylesheet formats, CSV exports
│       └── SettingsPage.tsx  # Profile updates, password rules, category budget limits
```

---

## 📡 REST API Documentation

### Authentication Vault
- `POST /api/auth/register` - Register new profile (autosubmits base seed transactions)
- `POST /api/auth/login` - Authenticate email & retrieve JWT session token
- `GET /api/auth/profile` - Fetch current active profile metadata (requires JWT)
- `PUT /api/auth/profile` - Update profile parameters & budget limits (requires JWT)
- `PUT /api/auth/change-password` - Resets profile password safely (requires JWT)
- `DELETE /api/auth/account` - Permanently deletes active user data & spends (requires JWT)

### Spends Registry
- `POST /api/expenses` - Append a new expense entry (requires JWT)
- `GET /api/expenses` - Retrieve entries with search, filters, and sorts (requires JWT)
- `GET /api/expenses/:id` - View details for a single expense (requires JWT)
- `PUT /api/expenses/:id` - Update fields for a single expense (requires JWT)
- `DELETE /api/expenses/:id` - Delete an expense record (requires JWT)

### Analytics Command
- `GET /api/dashboard` - Return calculated metrics, recent spends, monthly charts, and category allocations (requires JWT)

---

## 🔒 Security Practices Built-In

1. **XSS & Content Sniff Safeguards**: Express outputs custom headers (`X-Frame-Options`, `X-Content-Type-Options`, and `X-XSS-Protection`) automatically.
2. **Cryptographically Secure Key Derivations**: Native Node `crypto` hashes passwords with 1000 rounds of PBKDF2 sha512.
3. **Session Guards**: Resource routes are safeguarded behind JWT verification middleware, isolating user spaces from database leak overflows.
