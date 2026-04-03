import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import InsightsPage from './pages/InsightsPage'

const PAGE_TITLES = {
  '/':             'Overview',
  '/transactions': 'Transactions',
  '/insights':     'Insights',
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'Zorvyn'

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"             element={<DashboardPage />}    />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/insights"     element={<InsightsPage />}     />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  )
}
