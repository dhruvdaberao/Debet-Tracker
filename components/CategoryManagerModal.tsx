
import React, { useState } from 'react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onUpdateCategories: (newCategories: string[]) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  onUpdateCategories 
}) => {
  const [newCat, setNewCat] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      onUpdateCategories([...categories, newCat.trim()]);
      setNewCat('');
    }
  };

  const handleDelete = (cat: string) => {
    onUpdateCategories(categories.filter(c => c !== cat));
  };

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="bg-white curved border border-gray-100 shadow-2xl w-full max-w-md p-8 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold uppercase tracking-tighter">Manage Options</h3>
          <button onClick={onClose} className="text-2xl font-light">&times;</button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New option name..."
            className="flex-1 px-4 py-2 bg-gray-50 curved text-sm font-medium outline-none focus:ring-2 ring-yellow-400"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 curved font-bold text-[10px] uppercase hover:bg-yellow-400 hover:text-black transition-all"
          >
            Add
          </button>
        </form>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 curved border border-transparent hover:border-yellow-200 transition-all">
              <span className="text-xs font-bold uppercase tracking-tight">{cat}</span>
              <button 
                onClick={() => handleDelete(cat)}
                className="text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full p-4 curved bg-black text-white font-extrabold uppercase text-[10px] tracking-widest shadow-lg shadow-gray-200"
        >
          Done
        </button>
      </div>
    </div>
  );
};
