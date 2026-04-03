# Zorvyn — Finance Dashboard

A clean, interactive finance dashboard built for an internship evaluation. Designed to feel like a real fintech product — not a generic template.

---

## Features

**Dashboard Overview**
- Net balance, total income, and total expenses with month-over-month trend indicators
- Monthly cash flow area chart (income vs expenses)
- Expense breakdown donut chart by category
- Recent transactions feed

**Transactions**
- Full table with date, description, category, type, and amount
- Live search across description, category, and amount
- Filter by type: All / Income / Expenses
- Sort by date (newest/oldest) or amount (high/low)
- Responsive: table on desktop, card list on mobile

**Role-Based UI**
- Two roles: **Admin** and **Viewer**, toggled from the header
- Admin can add, edit, and delete transactions via a modal
- Viewer sees a clean read-only view — no action buttons visible

**Insights**
- Highlighted spending summary with month comparison text
- Top spending category, MoM expense change, savings rate, daily average
- Spending spike alert (category with the biggest MoM increase)
- February vs March comparison table
- Horizontal bar chart of all-time expenses by category

**UX**
- Dark mode toggle (persisted to localStorage)
- Fully responsive — mobile sidebar drawer, card layout on small screens
- Smooth transitions and hover states throughout
- Proper empty state for filtered results

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI + functional components + hooks |
| Tailwind CSS | Utility-first styling |
| Recharts | Charts (AreaChart, PieChart, BarChart) |
| React Router v6 | Client-side routing |
| Lucide React | Icons |
| Context API + useReducer | Global state management |
| localStorage | Persistence across sessions |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
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
│   └── transactions.js  # 56 realistic mock transactions across Jan–Mar 2026
├── hooks/
│   ├── useFilteredTransactions.js
│   └── useInsights.js
├── pages/
│   ├── DashboardPage.jsx
│   ├── InsightsPage.jsx
│   └── TransactionsPage.jsx
├── utils/
│   ├── calculations.js  # Pure financial calculation helpers
│   └── formatters.js    # Currency, date, percent formatters
└── App.jsx
```

---

## Design Decisions

**State: Context API + useReducer over Zustand**
Zustand would be fine here, but Context + useReducer keeps the dependency count low and is more than sufficient for this scale. The reducer makes state transitions explicit and easy to trace.

**No backend, no API calls**
All data is static mock data in `src/data/transactions.js`. Realistic enough to make the insights meaningful — 56 transactions across 3 months with category spread that produces interesting charts.

**Role-based UI is purely presentational**
Roles are frontend-only state — Admin unlocks the add/edit/delete UI, Viewer hides it. In a real app this would be backed by auth, but the UX pattern is correct.

**Dark mode via Tailwind's `class` strategy**
Toggling `dark` on `<html>` and persisting to localStorage gives instant, flicker-free switching without needing a CSS-in-JS library.

**Charts: Recharts**
Recharts integrates cleanly with React and gives enough control over styling to match the design system. Custom tooltips keep the look consistent with the rest of the UI.

---

## Assumptions

- Date context is Q1 2026 — insights compare March vs February of that year
- "This month" is always March 2026 in the insights page (would be dynamic in a real app)
- Amounts are in USD
- The investment category is treated as an expense (money leaving the account), which is standard for cash flow accounting
