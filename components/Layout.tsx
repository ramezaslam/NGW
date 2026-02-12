
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { logout } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const handleGlobalAdd = () => {
    window.dispatchEvent(new CustomEvent('glasspro:open-add'));
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-6 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 glass-blur z-40 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">{title}</h1>
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{today}</p>
        </div>
        <div className="flex gap-3 relative">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90 transition-transform">
            <span className="material-icons-round text-slate-600 dark:text-slate-300">notifications</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center overflow-hidden border border-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform"
            >
               <span className="material-icons-round text-white">person</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 z-[60] animate-in fade-in zoom-in duration-200">
                <div className="p-3 border-b border-slate-100 dark:border-slate-700 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Admin Workshop</p>
                </div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <span className="material-icons-round text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 glass-blur border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50 no-print">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">dashboard</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </NavLink>
        <NavLink to="/invoices" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">receipt_long</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Sales</span>
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">inventory_2</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Stock</span>
        </NavLink>
        <NavLink to="/workers" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">engineering</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Staff</span>
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">home_repair_service</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Jobs</span>
        </NavLink>
      </nav>
      
      <button 
        onClick={handleGlobalAdd}
        className="fixed right-6 bottom-24 w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 active:scale-90 transition-all hover:bg-emerald-600 z-40 no-print"
      >
        <span className="material-icons-round text-3xl">add</span>
      </button>
    </div>
  );
};

export default Layout;
