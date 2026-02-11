
import React from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
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
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 font-medium">{today}</p>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90 transition-transform">
            <span className="material-icons-round text-slate-600 dark:text-slate-300">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border border-emerald-200">
             <img src="https://picsum.photos/seed/glass/100/100" alt="Profile" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 glass-blur border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50 no-print">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">dashboard</span>
          <span className="text-[10px] font-semibold">Home</span>
        </NavLink>
        <NavLink to="/invoices" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">receipt_long</span>
          <span className="text-[10px] font-semibold">Sales</span>
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">inventory_2</span>
          <span className="text-[10px] font-semibold">Inventory</span>
        </NavLink>
        <NavLink to="/workers" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">engineering</span>
          <span className="text-[10px] font-semibold">Workers</span>
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
          <span className="material-icons-round">home_repair_service</span>
          <span className="text-[10px] font-semibold">Services</span>
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