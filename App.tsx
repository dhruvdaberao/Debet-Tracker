
import React, { useState, useEffect } from 'react';
import { PersonRecord, Entry } from './types';
import { EntryModal } from './components/EntryModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { INITIAL_CATEGORIES } from './constants';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [people, setPeople] = useState<PersonRecord[]>(() => {
    const saved = localStorage.getItem('hisab_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('hisab_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'plus' | 'minus';
    personId: string;
    personName: string;
  }>({
    isOpen: false,
    mode: 'plus',
    personId: '',
    personName: '',
  });

  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  useEffect(() => {
    localStorage.setItem('hisab_v3', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem('hisab_categories', JSON.stringify(categories));
  }, [categories]);

  const addPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson: PersonRecord = {
      id: crypto.randomUUID(),
      name: newPersonName.trim(),
      entries: [],
    };
    setPeople([...people, newPerson]);
    setNewPersonName('');
  };

  const deletePerson = (id: string) => {
    if (confirm("Delete this person and all their history?")) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const clearPersonEntries = (id: string) => {
    if (confirm("Clear all transactions for this person? The profile will remain.")) {
      setPeople(prev => prev.map(p => {
        if (p.id === id) {
          return { ...p, entries: [] };
        }
        return p;
      }));
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#000000', '#ffffff']
      });
    }
  };

  const handleSaveEntry = (amount: number, category: string) => {
    setPeople(prev => prev.map(p => {
      if (p.id === modalState.personId) {
        const newEntry: Entry = {
          id: crypto.randomUUID(),
          amount,
          category,
          timestamp: Date.now()
        };
        return { ...p, entries: [...p.entries, newEntry] };
      }
      return p;
    }));
  };

  const calculateIndividualTotal = (entries: Entry[]) => entries.reduce((acc, e) => acc + e.amount, 0);

  // Global Totals
  const globalSummary = people.reduce((acc, p) => {
    const total = calculateIndividualTotal(p.entries);
    if (total > 0) acc.receive += total;
    if (total < 0) acc.give += Math.abs(total);
    return acc;
  }, { receive: 0, give: 0 });

  return (
    <div className="min-h-screen p-4 md:p-12 max-w-6xl mx-auto flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tighter">Hisab</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Simple Ledger</p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex bg-white p-1.5 curved border border-gray-100 shadow-sm flex-1 md:flex-initial">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPerson()}
              placeholder="New name..."
              className="flex-1 md:w-40 px-4 bg-transparent font-medium text-xs outline-none"
            />
            <button
              onClick={addPerson}
              className="bg-black text-white px-5 py-1.5 curved font-bold text-[10px] uppercase hover:bg-yellow-400 hover:text-black transition-all"
            >
              Add
            </button>
          </div>
          
          <button
            onClick={() => setIsCatManagerOpen(true)}
            className="bg-white border border-gray-100 p-3 px-5 curved font-bold text-[10px] uppercase shadow-sm hover:border-yellow-400 transition-all flex items-center justify-center gap-2"
          >
            <span>Options</span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          </button>
        </div>
      </header>

      {/* Compact List View */}
      <div className="space-y-2 flex-1">
        {people.length === 0 && (
          <div className="py-20 text-center opacity-20 border-2 border-dashed border-gray-400 curved">
            <p className="text-[10px] font-bold uppercase tracking-widest">No records found</p>
          </div>
        )}

        {people.map((person) => {
          const total = calculateIndividualTotal(person.entries);
          return (
            <div 
              key={person.id} 
              className="bg-white curved border border-gray-100 px-5 py-3 flex flex-col md:flex-row items-center gap-4 group hover:border-yellow-200 hover:shadow-sm transition-all"
            >
              <div className="w-full md:w-40 flex flex-col">
                <h2 className="text-sm font-extrabold truncate uppercase tracking-tight">
                  {person.name}
                </h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => deletePerson(person.id)}
                    className="text-[8px] font-bold uppercase text-gray-300 hover:text-red-500 transition-colors w-fit"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => clearPersonEntries(person.id)}
                    className="text-[8px] font-bold uppercase text-gray-300 hover:text-blue-500 transition-colors w-fit"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full min-h-[40px]">
                {person.entries.length === 0 ? (
                  <span className="text-[9px] font-bold uppercase text-gray-200">New Account</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {person.entries.slice(-8).map((entry) => (
                      <div 
                        key={entry.id}
                        className={`pill-hover-container relative w-16 h-7 curved border flex items-center justify-center font-bold text-[10px] transition-colors overflow-hidden flex-shrink-0 ${
                          entry.amount >= 0 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                        }`}
                      >
                        <div className="pill-amount absolute inset-0 flex items-center justify-center bg-inherit">
                          {entry.amount >= 0 ? '+' : '-'}{Math.abs(entry.amount)}
                        </div>
                        <div className="pill-label absolute inset-0 translate-y-full flex items-center justify-center bg-black text-white px-1 text-[8px] uppercase tracking-tighter text-center leading-tight">
                          {entry.category}
                        </div>
                      </div>
                    ))}
                    {person.entries.length > 8 && (
                      <span className="text-[9px] font-bold text-gray-300">+{person.entries.length - 8}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold opacity-10">=</span>
                  <span className={`text-lg font-black tracking-tighter ${
                    total >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setModalState({ isOpen: true, mode: 'plus', personId: person.id, personName: person.name })}
                    className="w-8 h-8 curved bg-yellow-400 text-black font-black text-lg hover:bg-black hover:text-yellow-400 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setModalState({ isOpen: true, mode: 'minus', personId: person.id, personName: person.name })}
                    className="w-8 h-8 curved bg-black text-white font-black text-lg hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Summary Bottom Bar */}
      <div className="mt-8 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white curved p-6 border border-green-100 shadow-sm flex flex-col items-center md:items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Cash to Receive</span>
          <span className="text-4xl font-black text-green-600 tracking-tighter">₹{globalSummary.receive.toLocaleString()}</span>
        </div>
        <div className="bg-white curved p-6 border border-red-100 shadow-sm flex flex-col items-center md:items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Cash to Give</span>
          <span className="text-4xl font-black text-red-600 tracking-tighter">₹{globalSummary.give.toLocaleString()}</span>
        </div>
      </div>

      <EntryModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        personName={modalState.personName}
        categories={categories}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSave={handleSaveEntry}
      />

      <CategoryManagerModal
        isOpen={isCatManagerOpen}
        onClose={() => setIsCatManagerOpen(false)}
        categories={categories}
        onUpdateCategories={setCategories}
      />

      <footer className="mt-8 pb-8 text-center">
        <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400 opacity-50">Hisab • Clean Ledger</p>
      </footer>
    </div>
  );
};

export default App;
