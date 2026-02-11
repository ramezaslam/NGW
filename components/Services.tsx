
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassService } from '../types';

const Services: React.FC = () => {
  const { services, addService, deleteService } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<GlassService, 'id'>>({
    name: '',
    description: '',
    basePrice: 0,
    icon: 'home_repair_service'
  });

  useEffect(() => {
    const handleGlobalAdd = () => setIsModalOpen(true);
    window.addEventListener('glasspro:open-add', handleGlobalAdd);
    return () => window.removeEventListener('glasspro:open-add', handleGlobalAdd);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addService(formData);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', basePrice: 0, icon: 'home_repair_service' });
  };

  return (
    <div className="px-6 py-6 space-y-8">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Services Catalog</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform shadow-lg shadow-emerald-500/20"
        >
          <span className="material-icons-round text-sm">add</span> New Service
        </button>
      </div>

      {/* Featured Service */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <span className="bg-emerald-500 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">Premium Service</span>
          <h3 className="text-3xl font-black uppercase">Edge Polishing</h3>
          <p className="text-slate-400 text-sm max-w-xs">High-end aesthetic edges for mirror and tabletop glass projects with diamond-grade finishing.</p>
          <div className="flex items-center gap-4 mt-6">
            <span className="text-emerald-400 font-black text-lg tracking-tight">PKR 50.00 / ft</span>
            <button className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] active:scale-95 transition-transform">Book Now</button>
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <span className="material-icons-round text-[12rem]">auto_fix_high</span>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-700 flex flex-col gap-4 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-icons-round text-emerald-500 text-3xl group-hover:scale-110 transition-transform duration-500">{service.icon}</span>
              </div>
              <button onClick={() => deleteService(service.id)} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 rounded-lg active:scale-90 transition-all">
                <span className="material-icons-round text-lg">delete</span>
              </button>
            </div>
            <div>
              <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-lg">{service.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 h-8 line-clamp-2">{service.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Rate</span>
                 <span className="text-emerald-600 font-black">PKR {service.basePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black mb-6 text-slate-800 dark:text-white uppercase tracking-tight">New Service offering</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Service Name</label>
                <input
                  required
                  type="text"
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Double Glazing Fitting"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Service Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-medium"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Details about what is included..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Base Price (PKR)</label>
                <input
                  required
                  type="number"
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 dark:text-white font-black"
                  value={formData.basePrice}
                  onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-2 px-10 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
