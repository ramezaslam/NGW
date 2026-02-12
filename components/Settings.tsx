
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      updateSettings(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="px-6 py-6 space-y-8 max-w-4xl mx-auto">
      <div className="px-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">System Settings</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configure your workshop's global parameters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding Section */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-700 pb-4">
            <span className="material-icons-round text-emerald-500">branding_watermark</span>
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest">General Branding</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Shop Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-black dark:text-white"
                value={formData.shopName}
                onChange={e => setFormData({...formData, shopName: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Slogan / Tagline</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
                value={formData.tagline}
                onChange={e => setFormData({...formData, tagline: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Contact & Legal Section */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-700 pb-4">
            <span className="material-icons-round text-emerald-500">business</span>
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest">Contact & Legal Info</h3>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Workshop Address</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Phone Number</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-black dark:text-white"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">NTN / Registration #</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-black dark:text-white"
                value={formData.ntn}
                onChange={e => setFormData({...formData, ntn: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Invoice Config Section */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-700 pb-4">
            <span className="material-icons-round text-emerald-500">print</span>
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest">Invoice Configuration</h3>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Terms & Conditions (Invoice Footer)</label>
            <textarea 
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-medium dark:text-white text-xs leading-relaxed"
              value={formData.invoiceNotice}
              onChange={e => setFormData({...formData, invoiceNotice: e.target.value})}
            />
            <p className="text-[9px] text-slate-400 font-bold mt-2 ml-2 tracking-wide uppercase italic">This text will appear at the bottom-left of every printed invoice/quotation.</p>
          </div>
        </section>

        <div className="flex items-center justify-between pt-4 pb-12">
          {showSuccess ? (
            <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-xs animate-in fade-in slide-in-from-left duration-300">
               <span className="material-icons-round text-sm">check_circle</span>
               Settings Applied Successfully
            </div>
          ) : (
            <div></div>
          )}
          
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-12 py-5 bg-slate-900 dark:bg-emerald-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-3"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="material-icons-round text-lg">save</span>
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
