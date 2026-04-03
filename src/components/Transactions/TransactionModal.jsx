import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../data/transactions'

const EMPTY_FORM = {
  description: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
}

export default function TransactionModal({ editTarget, onClose }) {
  const { dispatch } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const firstInputRef = useRef(null)

  // Populate form when editing
  useEffect(() => {
    if (editTarget) {
      setForm({
        description: editTarget.description,
        amount:      String(editTarget.amount),
        category:    editTarget.category,
        type:        editTarget.type,
        date:        editTarget.date,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editTarget])

  // Focus first input + trap scroll
  useEffect(() => {
    firstInputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.description.trim()) errs.description = 'Required'
    const amt = parseFloat(form.amount)
    if (isNaN(amt) || amt <= 0) errs.amount = 'Must be a positive number'
    if (!form.date) errs.date = 'Required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      ...(editTarget ? { id: editTarget.id } : {}),
    }

    dispatch({
      type: editTarget ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION',
      payload,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {editTarget ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Description */}
          <div>
            <label className="label">Description</label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.description}
              onChange={set('description')}
              placeholder="e.g. Grocery Run"
              className={`input ${errors.description ? 'ring-2 ring-rose-500 border-transparent' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount + Type row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount ($)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={set('amount')}
                placeholder="0.00"
                className={`input ${errors.amount ? 'ring-2 ring-rose-500 border-transparent' : ''}`}
              />
              {errors.amount && (
                <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="label">Type</label>
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 gap-1 h-[38px]">
                {['income', 'expense'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={`flex-1 rounded-lg text-xs font-medium capitalize transition-colors duration-150 ${
                      form.type === t
                        ? t === 'income'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={set('category')} className="input">
                {Object.values(CATEGORIES).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={set('date')}
                className={`input ${errors.date ? 'ring-2 ring-rose-500 border-transparent' : ''}`}
              />
              {errors.date && (
                <p className="text-xs text-rose-500 mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              {editTarget ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
