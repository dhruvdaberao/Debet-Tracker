
import React, { useState } from 'react';
// Corrected imports: Category is defined locally from INITIAL_CATEGORIES
import { INITIAL_CATEGORIES, SUGGESTED_NAMES } from '../constants';

// Define Category based on INITIAL_CATEGORIES
type Category = typeof INITIAL_CATEGORIES[number];

// Locally defined as it is specific to this form's internal logic
type TransactionType = 'lent' | 'borrowed';

// Replaced non-existent Transaction type with local interface
interface TransactionFormData {
  person: string;
  amount: number;
  type: TransactionType;
  reason: string;
  category: Category;
}

interface TransactionFormProps {
  onAdd: (transaction: TransactionFormData) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('lent');
  const [reason, setReason] = useState('');
  // Explicitly typing as Category to prevent literal string narrowing issues and using INITIAL_CATEGORIES
  const [category, setCategory] = useState<Category>(INITIAL_CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!person || !amount || isNaN(Number(amount))) return;

    onAdd({
      person,
      amount: Math.abs(Number(amount)),
      type,
      reason,
      category
    });

    setPerson('');
    setAmount('');
    setReason('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 neo-border neo-shadow space-y-4">
      <h3 className="text-xl font-bold font-heading mb-4 border-b-2 border-black pb-2">Record New Hisab</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-tight">Who's involved?</label>
          <input
            list="names"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            placeholder="Name"
            className="w-full p-2 neo-border focus:bg-yellow-50 outline-none transition-colors"
          />
          <datalist id="names">
            {SUGGESTED_NAMES.map(n => <option key={n} value={n} />)}
          </datalist>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-tight">How Much? (₹)</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('lent')}
              className={`flex-1 p-2 neo-border font-bold text-sm transition-all ${type === 'lent' ? 'bg-green-400 translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-white neo-shadow hover:bg-green-50'}`}
            >
              + Given
            </button>
            <button
              type="button"
              onClick={() => setType('borrowed')}
              className={`flex-1 p-2 neo-border font-bold text-sm transition-all ${type === 'borrowed' ? 'bg-red-400 translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-white neo-shadow hover:bg-red-50'}`}
            >
              - Taken
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-tight">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-2 neo-border focus:bg-blue-50 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-tight">Category</label>
          <select
            value={category}
            // Cast target value to Category to resolve string assignment error
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full p-2 neo-border bg-white outline-none"
          >
            {/* Corrected constant name to INITIAL_CATEGORIES */}
            {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-tight">Reason / Note</label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Starbucks outing, shared taxi..."
          className="w-full p-2 neo-border focus:bg-purple-50 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white p-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors neo-shadow active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        Save Entry
      </button>
    </form>
  );
};
