
import React, { useState, useEffect } from 'react';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, category: string) => void;
  mode: 'plus' | 'minus';
  personName: string;
  categories: string[];
}

export const EntryModal: React.FC<EntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  mode, 
  personName,
  categories
}) => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    
    const categoryToSave = isCustomMode ? (customCategory || 'Other') : selectedCategory;
    
    onSave(mode === 'plus' ? num : -num, categoryToSave);
    setAmount('');
    setCustomCategory('');
    setIsCustomMode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="bg-white curved border border-gray-100 shadow-2xl w-full max-w-lg p-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${mode === 'plus' ? 'bg-yellow-400' : 'bg-black'}`}></div>
            <h3 className="text-xl font-extrabold uppercase tracking-tighter">
              Entry for {personName}
            </h3>
          </div>
          <button onClick={onClose} className="text-2xl font-light hover:rotate-90 transition-transform">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-[10px] font-bold uppercase mb-4 tracking-widest text-gray-300">Amount to {mode === 'plus' ? 'Add' : 'Subtract'}</label>
            <div className="relative">
              <span className="absolute left-0 bottom-4 text-4xl font-extrabold text-gray-100">₹</span>
              <input
                autoFocus
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent border-b-2 border-black pl-8 pb-4 text-6xl font-extrabold outline-none placeholder:text-gray-50"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Category Entity</label>
              <button 
                type="button" 
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-[9px] font-bold uppercase underline decoration-yellow-400 decoration-2"
              >
                {isCustomMode ? 'Use Presets' : 'Add Custom +'}
              </button>
            </div>

            {isCustomMode ? (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type anything (e.g. Cinema, Gift...)"
                className="w-full p-4 curved bg-gray-50 border-none font-bold text-sm outline-none focus:ring-2 ring-yellow-400"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto no-scrollbar p-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 curved border font-bold text-[9px] uppercase tracking-tight transition-all text-center leading-tight ${
                      selectedCategory === cat 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-black border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full p-5 curved font-extrabold uppercase text-xs tracking-[0.2em] transition-all ${
              mode === 'plus' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-100' : 'bg-black text-white shadow-lg shadow-gray-200'
            }`}
          >
            Confirm {mode === 'plus' ? 'Lend' : 'Borrow'}
          </button>
        </form>
      </div>
    </div>
  );
};
