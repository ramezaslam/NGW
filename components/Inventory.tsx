
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
// Fix: Import ProductCategory instead of non-existent GlassCategory
import { GlassItem, ProductCategory } from '../types';

const Inventory: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GlassItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<GlassItem>>({
    name: '',
    sku: '',
    thicknessMM: 5, // Default thickness
    pricePerSqFt: 0,
    stock: 0,
    // Fix: Using 'Plain Glass' to match ProductCategory type
    category: 'Plain Glass',
    unit: 'sq ft',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?auto=format&fit=crop&q=80&w=200'
  });

  useEffect(() => {
    const handleGlobalAdd = () => openModal();
    window.addEventListener('glasspro:open-add', handleGlobalAdd);
    return () => window.removeEventListener('glasspro:open-add', handleGlobalAdd);
  }, []);

  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateInventoryItem({ ...editingItem, ...formData } as GlassItem);
    } else {
      addInventoryItem(formData as Omit<GlassItem, 'id'>);
    }
    closeModal();
  };

  const openModal = (item?: GlassItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        thicknessMM: 5,
        pricePerSqFt: 0,
        stock: 0,
        // Fix: Using 'Plain Glass' to match ProductCategory type
        category: 'Plain Glass',
        unit: 'sq ft',
        image: 'https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?auto=format&fit=crop&q=80&w=200'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Inventory Stock</h2>
        <button 
          onClick={() => openModal()}
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform shadow-lg shadow-emerald-500/20"
        >
          <span className="material-icons-round text-sm">add</span> New Glass
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search glass catalog..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-50 dark:border-slate-700 flex gap-5 shadow-sm group hover:shadow-md transition-all">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight">{item.name} <span className="text-emerald-500">{item.thicknessMM}MM</span></h4>
                  <span className="text-emerald-600 font-black text-xs">PKR {item.pricePerSqFt}/sqft</span>
                </div>
                <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black mt-1">SKU: {item.sku}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.stock > 100 ? 'bg-emerald-500' : item.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'} shadow-sm`}></div>
                  <span className={`text-xs font-black uppercase tracking-tighter ${item.stock <= 50 ? 'text-rose-600 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.stock} {item.unit} Available
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(item)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 rounded-lg active:scale-90 transition-all">
                    <span className="material-icons-round text-lg">edit</span>
                  </button>
                  <button onClick={() => deleteInventoryItem(item.id)} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-lg active:scale-90 transition-all">
                    <span className="material-icons-round text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black mb-6 text-slate-800 dark:text-white uppercase tracking-tight">{editingItem ? 'Edit Item' : 'New Glass Stock'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Glass Name / Description</label>
                <input 
                  required
                  type="text" 
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Bronze Tinted"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">SKU Code</label>
                  <input 
                    required
                    type="text" 
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-bold"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    placeholder="GLS-001"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Thickness (MM)</label>
                  <input 
                    required
                    type="number" 
                    step="0.5"
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-bold text-center"
                    value={formData.thicknessMM}
                    onChange={e => setFormData({...formData, thicknessMM: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Rate (PKR/sqft)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-black"
                    value={formData.pricePerSqFt}
                    onChange={e => setFormData({...formData, pricePerSqFt: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Current Stock (SQFT)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-black"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={closeModal} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-2 px-10 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">
                  {editingItem ? 'Update Stock' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
