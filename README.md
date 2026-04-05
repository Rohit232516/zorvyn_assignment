# Zorvyn — Finance Dashboard

A clean, interactive personal finance dashboard built as a frontend engineering evaluation.
Designed to feel like a real fintech product — not a generic template.

🔗 **Live Demo:** ([https://zorvyn-assignment.vercel.app](https://zorvyn-lm25uxh5u-rohitreddy2325-4479s-projects.vercel.app))
📁 **GitHub:** [https://github.com/Rohit232516/zorvyn_assignment](https://github.com/Rohit232516/zorvyn_assignment)

---

## Features

### Dashboard Overview
- Net balance, total income, and total expenses with month-over-month trend indicators
- Monthly cash flow area chart (income vs. expenses)
- Expense breakdown donut chart by category
- Recent transactions feed

### Transactions
- Full table with date, description, category, type, and amount
- Live search across description, category, and amount
- Filter by type: All / Income / Expenses
- Sort by date (newest/oldest) or amount (high/low)
- Responsive: table on desktop, card list on mobile

### Role-Based UI
- Two roles: **Admin** and **Viewer**, toggled from the header
- Admin: can add, edit, and delete transactions via a modal
- Viewer: clean read-only mode — no action buttons visible

### Insights
- Spending summary with month-over-month comparison
- Top spending category, MoM expense change, savings rate, daily average
- Spending spike alert (category with the biggest MoM increase)
- February vs. March comparison table
- Horizontal bar chart of all-time expenses by category

### UX
- Dark mode toggle (persisted to `localStorage`)
- Fully responsive — mobile sidebar drawer, card layout on small screens
- Smooth transitions and hover states throughout
- Proper empty state for filtered results

---

## Tech Stack

| Tool | Category | Purpose |
|---|---|---|
| React 18 | Frontend | UI rendering, functional components & hooks |
| Tailwind CSS | Styling | Utility-first responsive design |
| Recharts | Data Viz | AreaChart, PieChart, BarChart |
| React Router v6 | Routing | Client-side navigation |
| Context API + useReducer | State | Global state management |
| Lucide React | Icons | Consistent icon system |
| localStorage | Persistence | Dark mode retention across sessions |
---

## Getting Started
```bash
# Clone the repo
git clone https://github.com/Rohit232516/zorvyn_assignment.git
cd zorvyn_assignment

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure
src/
├── components/
│   ├── Dashboard/        # SummaryCard, BalanceTrendChart, ExpenseBreakdownChart
│   ├── Insights/         # InsightCard
│   ├── Layout/           # Sidebar, Header
│   ├── Transactions/     # TransactionTable, TransactionFilters, TransactionModal
│   └── UI/               # Badge, EmptyState
├── context/
│   └── AppContext.jsx    # Global state: transactions, role, filters, dark mode
├── data/
│   └── transactions.js   # 56 realistic mock transactions across Jan–Mar 2026
├── hooks/
│   ├── useFilteredTransactions.js
│   └── useInsights.js
├── pages/
│   ├── DashboardPage.jsx
│   ├── InsightsPage.jsx
│   └── TransactionsPage.jsx
├── utils/
│   ├── calculations.js   # Pure financial calculation helpers
│   └── formatters.js     # Currency, date, percent formatters
└── App.jsx
---

## Design Decisions

**Context API + useReducer over Zustand** — Keeps the dependency count low and is more than sufficient for this scale. The reducer makes state transitions explicit and easy to trace.

**No backend / no API calls** — All data is static mock data in `src/data/transactions.js`. 56 transactions across 3 months with enough category spread to produce meaningful charts and insights.

**Role-based UI is presentational** — Roles are frontend-only state. Admin unlocks the add/edit/delete UI; Viewer hides it. In a real app this would be backed by auth, but the UX pattern is production-correct.

**Dark mode via Tailwind's class strategy** — Toggling `dark` on `<html>` and persisting to `localStorage` gives instant, flicker-free switching without a CSS-in-JS library.

**Recharts for charts** — Integrates cleanly with React and allows enough styling control to match the design system. Custom tooltips keep the look consistent.

---

## Assumptions

- Date context is Q1 2026 — insights compare March vs. February
- "This month" is always March 2026 on the Insights page (would be dynamic in production)
- Amounts are in USD
- The investment category is treated as an expense (money leaving the account), which is standard for cash flow accounting
