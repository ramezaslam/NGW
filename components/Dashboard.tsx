
import React, { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import { InvoiceStatus, Invoice } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { invoices, inventory } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalAdd = () => {
      navigate('/invoices');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('glasspro:open-add'));
      }, 50);
    };
    window.addEventListener('glasspro:open-add', handleGlobalAdd);
    return () => window.removeEventListener('glasspro:open-add', handleGlobalAdd);
  }, [navigate]);

  const handleQuickEdit = (inv: Invoice) => {
    navigate('/invoices');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('glasspro:open-edit', { detail: { invoice: inv } }));
    }, 50);
  };

  // Profit & Loss Calculations
  const salesInvoices = invoices.filter(inv => inv.docType === 'INVOICE');
  const revenue = salesInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  
  const costOfGoods = salesInvoices.reduce((acc, inv) => {
    const cost = inv.items.reduce((sum, item) => sum + (item.quantity * item.costPriceAtTime), 0);
    return acc + cost;
  }, 0);
  
  const grossProfit = revenue - costOfGoods;
  const netMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  // Category Wise Profit
  const glassProfit = salesInvoices.reduce((acc, inv) => {
    return acc + inv.items
      .filter(it => it.type === 'glass')
      .reduce((sum, it) => sum + (it.quantity * (it.unitPrice - it.costPriceAtTime)), 0);
  }, 0);

  const aluminumProfit = salesInvoices.reduce((acc, inv) => {
    return acc + inv.items
      .filter(it => it.type === 'aluminum')
      .reduce((sum, it) => sum + (it.quantity * (it.unitPrice - it.costPriceAtTime)), 0);
  }, 0);

  const serviceProfit = salesInvoices.reduce((acc, inv) => {
    return acc + inv.items
      .filter(it => it.type === 'service')
      .reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0); // Service cost is usually labor, not COGS
  }, 0);

  const categoryData = [
    { name: 'Glass', profit: glassProfit, color: '#10b981' },
    { name: 'Aluminum', profit: aluminumProfit, color: '#64748b' },
    { name: 'Services', profit: serviceProfit, color: '#f59e0b' },
  ];
  
  const pendingAmount = invoices
    .filter(inv => inv.status === InvoiceStatus.UNPAID || inv.status === InvoiceStatus.PENDING_APPROVAL)
    .reduce((acc, inv) => acc + inv.amount, 0);

  const inventoryValue = inventory.reduce((acc, item) => acc + (item.stock * item.costPrice), 0);

  return (
    <div className="px-6 py-6 space-y-6">
      {/* P&L Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Revenue</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">PKR {revenue.toLocaleString()}</h2>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
            <span className="material-icons-round text-sm">trending_up</span>
            <span>Total Sales Volume</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Material Costs (COGS)</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">PKR {costOfGoods.toLocaleString()}</h2>
          <div className="mt-4 flex items-center gap-2 text-rose-500 font-bold text-xs uppercase">
            <span className="material-icons-round text-sm">receipt</span>
            <span>Procurement Expenses</span>
          </div>
        </div>

        <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/30 relative overflow-hidden">
          <p className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-1">Gross Profit (P&L)</p>
          <h2 className="text-4xl font-black tracking-tighter">PKR {grossProfit.toLocaleString()}</h2>
          <div className="mt-4 flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full w-fit text-[10px] font-black uppercase tracking-widest">
            <span className="material-icons-round text-sm">insights</span>
            <span>{netMargin.toFixed(1)}% Net Margin</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit by Category */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-black mb-6 uppercase tracking-tight flex items-center gap-2">
            <span className="material-icons-round text-emerald-500">bar_chart</span>
            Profit by Department
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontWeight: 'bold', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="profit" radius={[0, 10, 10, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory & Cash */}
        <div className="space-y-6">
          <div className="bg-amber-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-500/30 flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Assets (Stock Value)</p>
              <h2 className="text-3xl font-black">PKR {inventoryValue.toLocaleString()}</h2>
            </div>
            <span className="material-icons-round text-6xl opacity-30">inventory_2</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Awaiting Payments</p>
              <h2 className="text-3xl font-black text-rose-500">PKR {pendingAmount.toLocaleString()}</h2>
            </div>
            <span className="material-icons-round text-6xl text-rose-500/10">pending_actions</span>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Recent Business Activity</h3>
          <button onClick={() => navigate('/invoices')} className="text-emerald-500 text-xs font-black uppercase tracking-widest hover:underline">Full History</button>
        </div>
        <div className="space-y-4">
          {invoices.slice(0, 5).map((inv) => (
            <div key={inv.id} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-3xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  inv.docType === 'INVOICE' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {inv.clientName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{inv.clientName}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{inv.invoiceNumber} • {inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-black text-slate-800 dark:text-white">PKR {inv.amount.toLocaleString()}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${
                    inv.status === InvoiceStatus.PAID ? 'text-emerald-500' : 'text-amber-500'
                  }`}>{inv.status}</p>
                </div>
                <button onClick={() => handleQuickEdit(inv)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-600 text-slate-400 hover:text-emerald-500 rounded-xl shadow-sm transition-all active:scale-90">
                  <span className="material-icons-round text-xl">edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
