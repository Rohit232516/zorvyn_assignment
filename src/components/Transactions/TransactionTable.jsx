import { Pencil, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { CATEGORY_COLORS } from '../../data/transactions'
import Badge from '../UI/Badge'
import EmptyState from '../UI/EmptyState'

export default function TransactionTable({ onEdit }) {
  const { state, dispatch } = useApp()
  const { role } = state
  const transactions = useFilteredTransactions()
  const isAdmin = role === 'admin'

  const handleDelete = (id) => {
    if (confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="card">
        <EmptyState
          title="No transactions found"
          message="Try adjusting your search or filter."
        />
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Description
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Category
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Type
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Amount
              </th>
              {isAdmin && (
                <th className="px-5 py-3 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {transactions.map((tx) => (
              <TableRow
                key={tx.id}
                tx={tx}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-700">
        {transactions.map((tx) => (
          <MobileRow
            key={tx.id}
            tx={tx}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700">
        <p className="text-xs text-slate-400">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

function TableRow({ tx, isAdmin, onEdit, onDelete }) {
  const color = CATEGORY_COLORS[tx.category] ?? '#94a3b8'
  const isIncome = tx.type === 'income'

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(tx.date, 'short')}
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {tx.description}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: color }}
          />
          <span className="text-xs text-slate-600 dark:text-slate-300">{tx.category}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <Badge variant={isIncome ? 'income' : 'expense'}>
          {isIncome ? 'Income' : 'Expense'}
        </Badge>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className={`flex items-center justify-end gap-1 font-semibold text-sm ${
          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}>
          {isIncome
            ? <ArrowUpRight size={14} />
            : <ArrowDownLeft size={14} />
          }
          {formatCurrency(tx.amount)}
        </div>
      </td>
      {isAdmin && (
        <td className="px-5 py-3.5">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(tx)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(tx.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}

function MobileRow({ tx, isAdmin, onEdit, onDelete }) {
  const isIncome = tx.type === 'income'
  const color = CATEGORY_COLORS[tx.category] ?? '#94a3b8'

  return (
    <div className="px-4 py-3.5 flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold"
        style={{ background: color }}
      >
        {tx.category[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
          {tx.description}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {formatDate(tx.date, 'short')} · {tx.category}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${
          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}>
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
        </span>
        {isAdmin && (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(tx)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(tx.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
