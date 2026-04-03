import { useState } from 'react'
import { Plus, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useDataLoader } from '../hooks/useDataLoader'
import TransactionFilters from '../components/Transactions/TransactionFilters'
import TransactionTable from '../components/Transactions/TransactionTable'
import TransactionModal from '../components/Transactions/TransactionModal'
import { TransactionsSkeleton } from '../components/UI/Skeleton'
import ErrorState from '../components/UI/ErrorState'

export default function TransactionsPage() {
  const { state } = useApp()
  const { role } = state
  const isAdmin = role === 'admin'
  const { isLoading, isError, retry } = useDataLoader(700)

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const openAdd = () => {
    setEditTarget(null)
    setModalOpen(true)
  }

  const openEdit = (tx) => {
    setEditTarget(tx)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 animate-fade-in">
      {/* Page actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdmin ? 'Manage and track your transactions' : 'Read-only view'}
          </p>
        </div>

        {isAdmin ? (
          <button onClick={openAdd} className="btn-primary self-start sm:self-auto">
            <Plus size={16} />
            Add Transaction
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
            <Lock size={12} />
            Viewer mode — no edits allowed
          </div>
        )}
      </div>

      {/* Filters — always visible so users can change them */}
      <TransactionFilters />

      {/* Table — guarded by load state */}
      {isLoading ? (
        <TransactionsSkeleton />
      ) : isError ? (
        <div className="card">
          <ErrorState
            message="Couldn't fetch your transactions. Check your connection and try again."
            onRetry={retry}
          />
        </div>
      ) : (
        <TransactionTable onEdit={openEdit} />
      )}

      {/* Modal */}
      {modalOpen && (
        <TransactionModal editTarget={editTarget} onClose={closeModal} />
      )}
    </div>
  )
}
