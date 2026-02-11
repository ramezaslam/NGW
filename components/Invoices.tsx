
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { InvoiceStatus, InvoiceLineItem, DocumentType, Invoice } from '../types';

const Invoices: React.FC = () => {
  const { invoices, inventory, services, workers, addInvoice, updateInvoice } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<DocumentType>('INVOICE');

  // Form State
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [selectedItems, setSelectedItems] = useState<InvoiceLineItem[]>([]);
  const [assignedWorkerId, setAssignedWorkerId] = useState('');
  const [creatingDocType, setCreatingDocType] = useState<DocumentType>('INVOICE');

  // Print state
  const [printDoc, setPrintDoc] = useState<Invoice | null>(null);

  // Print Cleanup Logic
  useEffect(() => {
    const handleAfterPrint = () => setPrintDoc(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  useEffect(() => {
    const handleGlobalAdd = () => {
      setCreatingDocType(activeTab);
      setEditingInvoiceId(null);
      resetForm();
      setIsModalOpen(true);
    };
    window.addEventListener('glasspro:open-add', handleGlobalAdd);
    const handleGlobalEdit = (e: any) => { if (e.detail?.invoice) handleEdit(e.detail.invoice); };
    window.addEventListener('glasspro:open-edit', handleGlobalEdit);
    return () => {
      window.removeEventListener('glasspro:open-add', handleGlobalAdd);
      window.removeEventListener('glasspro:open-edit', handleGlobalEdit);
    };
  }, [activeTab]);

  const resetForm = () => {
    setClientName('');
    setInvoiceDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
    setSelectedItems([]);
    setAssignedWorkerId('');
    setEditingInvoiceId(null);
  };

  const handleEdit = (inv: Invoice) => {
    setEditingInvoiceId(inv.id);
    setClientName(inv.clientName);
    setInvoiceDate(inv.date);
    setSelectedItems([...inv.items]);
    setCreatingDocType(inv.docType);
    setAssignedWorkerId(inv.assignedWorkerId || '');
    setIsModalOpen(true);
  };

  const calculateTotal = (items: InvoiceLineItem[]) => items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return alert('Add items to the document first.');
    const data = {
      clientName,
      date: invoiceDate,
      items: selectedItems,
      amount: calculateTotal(selectedItems),
      docType: creatingDocType,
      assignedWorkerId: assignedWorkerId || undefined,
      status: creatingDocType === 'QUOTATION' ? InvoiceStatus.PENDING_APPROVAL : InvoiceStatus.UNPAID
    };

    if (editingInvoiceId) {
      const original = invoices.find(i => i.id === editingInvoiceId);
      if (original) updateInvoice({ ...original, ...data });
    } else {
      addInvoice(data);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const addItemFromInventory = (item: any) => {
    const isGlass = item.category?.toLowerCase().includes('glass') || 
                    item.category?.toLowerCase().includes('tinted') || 
                    item.category?.toLowerCase().includes('mirror');
    
    setSelectedItems([...selectedItems, {
      id: Math.random().toString(),
      description: item.name,
      quantity: isGlass ? 0 : 1, // Area is 0 until dimensions entered for glass
      unitPrice: item.pricePerSqFt || item.basePrice,
      costPriceAtTime: item.costPrice || 0,
      type: isGlass ? 'glass' : (item.category?.includes('Aluminum') ? 'aluminum' : 'service'),
      width: isGlass ? 0 : undefined, 
      height: isGlass ? 0 : undefined
    }]);
  };

  const updateLineItem = (idx: number, field: string, val: any) => {
    const newItems = [...selectedItems];
    const item = newItems[idx];
    (item as any)[field] = val;
    
    // Auto-calculate Area for Glass
    if (item.type === 'glass' && (field === 'width' || field === 'height')) {
      const w = field === 'width' ? val : (item.width || 0);
      const h = field === 'height' ? val : (item.height || 0);
      if (w > 0 && h > 0) {
        item.quantity = (w * h) / 144;
      }
    }
    setSelectedItems(newItems);
  };

  const handlePrint = (doc: Invoice) => {
    setPrintDoc(doc);
    // Give react a moment to render the portal content before triggering print
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const PrintableDocument = ({ doc }: { doc: Invoice }) => (
    <div className="printable-area bg-white text-black p-10 min-h-screen flex flex-col font-sans">
      <div className="flex justify-between border-b-4 border-slate-900 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">GLASS & ALU PRO</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Industrial Fittings & Fabrications</p>
          <div className="mt-6 text-[11px] font-bold text-slate-600 space-y-0.5">
            <p>Main G.T Road, Workshop Zone, Gujranwala</p>
            <p>Cell: +92 300 1234567 | NTN: 7766554-1</p>
          </div>
        </div>
        <div className="text-right flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-black uppercase text-slate-800">{doc.docType}</h2>
            <p className="text-xl font-black text-emerald-600 mt-1">{doc.invoiceNumber}</p>
          </div>
          <p className="text-[10px] font-bold text-slate-400">Date: {doc.date}</p>
        </div>
      </div>

      <div className="mb-10 bg-slate-50 p-6 rounded-2xl">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Account</p>
        <p className="text-2xl font-black text-slate-900">{doc.clientName}</p>
      </div>

      <table className="w-full text-left mb-auto">
        <thead>
          <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest">
            <th className="py-3">Description</th>
            <th className="py-3 text-center">Dimensions</th>
            <th className="py-3 text-center">Qty / Area</th>
            <th className="py-3 text-right">Rate</th>
            <th className="py-3 text-right">Total (PKR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {doc.items.map((it, idx) => (
            <tr key={idx} className="text-[11px]">
              <td className="py-4 font-bold text-slate-800 uppercase tracking-tight">{it.description}</td>
              <td className="py-4 text-center text-slate-500">{it.width ? `${it.width}" × ${it.height}"` : '—'}</td>
              <td className="py-4 text-center font-black">{it.quantity.toFixed(2)}</td>
              <td className="py-4 text-right">{it.unitPrice.toLocaleString()}</td>
              <td className="py-4 text-right font-black text-slate-900">{(it.quantity * it.unitPrice).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12 pt-8 border-t-2 border-slate-900 flex justify-between items-start">
        <div className="text-[8px] text-slate-400 max-w-sm leading-relaxed">
          <p className="font-black uppercase mb-1">Office Notice:</p>
          1. Check materials before installation. No claims after fixing.<br/>
          2. 50% advance for all custom Aluminum frame orders.<br/>
          3. Broken glass after delivery is customer's responsibility.
        </div>
        <div className="w-64 space-y-2">
          <div className="flex justify-between font-bold text-[10px] text-slate-400 uppercase">
            <span>Subtotal</span>
            <span>PKR {doc.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-black uppercase">Grand Total</span>
            <span className="text-3xl font-black text-slate-900">PKR {doc.amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-20 flex justify-between px-6">
        <div className="text-center w-40 border-t border-slate-300 pt-3">
          <p className="text-[9px] font-black uppercase text-slate-400">Customer</p>
        </div>
        <div className="text-center w-40 border-t border-slate-300 pt-3">
          <p className="text-[9px] font-black uppercase text-slate-400">Authorized Signature</p>
        </div>
      </div>
    </div>
  );

  const filteredDocs = invoices.filter(i => 
    i.docType === activeTab && 
    i.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Portal for Print Engine */}
      {printDoc && createPortal(<PrintableDocument doc={printDoc} />, document.body)}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Business Records</h2>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-3xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('INVOICE')} 
            className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'INVOICE' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Invoices
          </button>
          <button 
            onClick={() => setActiveTab('QUOTATION')} 
            className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'QUOTATION' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Quotations
          </button>
        </div>
      </div>

      <div className="space-y-4 no-print">
        <div className="relative">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder={`Search ${activeTab.toLowerCase()} by client...`}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filteredDocs.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700">
             <span className="material-icons-round text-6xl text-slate-200 dark:text-slate-700">history</span>
             <p className="text-xs font-black uppercase text-slate-400 mt-4 tracking-widest">No entries found in this section</p>
          </div>
        ) : (
          filteredDocs.map(inv => (
            <div key={inv.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-6 group hover:shadow-xl transition-all">
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-inner ${
                  inv.docType === 'INVOICE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {inv.clientName[0]}
                </div>
                <div>
                  <h4 className="font-black text-xl text-slate-800 dark:text-white tracking-tight">{inv.clientName}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.invoiceNumber}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto gap-10">
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">PKR {inv.amount.toLocaleString()}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${inv.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>{inv.status}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(inv)} 
                    className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-emerald-500 rounded-2xl active:scale-90 transition-all"
                    title="Edit Record"
                  >
                    <span className="material-icons-round">edit</span>
                  </button>
                  <button 
                    onClick={() => handlePrint(inv)} 
                    className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-90 transition-all"
                    title="Print Document"
                  >
                    <span className="material-icons-round">print</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 no-print">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl sm:rounded-[3rem] rounded-t-[3rem] p-10 max-h-[95vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">{editingInvoiceId ? 'Modify Document' : 'Draft New Document'}</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Industrial Grade Fabrication Billing</p>
               </div>
               <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                 <span className="material-icons-round">close</span>
               </button>
            </div>

            <form onSubmit={handleAddInvoice} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Client Name</label>
                  <input required placeholder="Full Name..." className="w-full p-5 bg-slate-50 dark:bg-slate-700 rounded-2xl border-none font-bold dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all" value={clientName} onChange={e=>setClientName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Date</label>
                  <input required placeholder="Oct 20, 2024" className="w-full p-5 bg-slate-50 dark:bg-slate-700 rounded-2xl border-none font-bold dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all" value={invoiceDate} onChange={e=>setInvoiceDate(e.target.value)} />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Materials & Hardware</label>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {inventory.map(item => (
                    <button key={item.id} type="button" onClick={() => addItemFromInventory(item)} className="shrink-0 px-6 py-4 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-[1.5rem] shadow-sm hover:border-emerald-500 hover:text-emerald-500 transition-all group text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{item.name}</p>
                      <p className="text-[8px] text-slate-400 font-bold">PKR {item.pricePerSqFt}/{item.unit}</p>
                    </button>
                  ))}
                  {services.map(srv => (
                    <button key={srv.id} type="button" onClick={() => addItemFromInventory({...srv, category: 'Service'})} className="shrink-0 px-6 py-4 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-[1.5rem] shadow-sm hover:border-amber-500 hover:text-amber-500 transition-all group text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{srv.name}</p>
                      <p className="text-[8px] text-slate-400 font-bold">Base: PKR {srv.basePrice}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Detailed Ledger Items</label>
                {selectedItems.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem]">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Select items from above to build invoice</p>
                  </div>
                ) : (
                  selectedItems.map((it, idx) => (
                    <div key={it.id} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 space-y-6 relative group">
                      <div className="flex justify-between items-center">
                        <input 
                          className="bg-transparent border-none p-0 focus:ring-0 font-black text-slate-800 dark:text-white uppercase tracking-tight flex-1 text-lg" 
                          value={it.description} 
                          onChange={e => updateLineItem(idx, 'description', e.target.value)}
                        />
                        <button type="button" onClick={() => setSelectedItems(selectedItems.filter((_, i) => i !== idx))} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-icons-round">delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-end">
                        {it.type === 'glass' && (
                          <>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Width (in)</label>
                              <input type="number" step="0.1" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border-none font-bold dark:text-white text-center focus:ring-2 focus:ring-emerald-500" value={it.width || ''} onChange={e=>updateLineItem(idx,'width',parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Height (in)</label>
                              <input type="number" step="0.1" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border-none font-bold dark:text-white text-center focus:ring-2 focus:ring-emerald-500" value={it.height || ''} onChange={e=>updateLineItem(idx,'height',parseFloat(e.target.value) || 0)} />
                            </div>
                          </>
                        )}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2">{it.type === 'glass' ? 'Area (SqFt)' : 'Quantity'}</label>
                          <input type="number" step="0.01" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border-none font-black text-emerald-500 text-center focus:ring-2 focus:ring-emerald-500" value={it.quantity || ''} onChange={e=>updateLineItem(idx,'quantity',parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Rate (PKR)</label>
                          <input type="number" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border-none font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" value={it.unitPrice} onChange={e=>updateLineItem(idx,'unitPrice',parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Net Total</label>
                          <div className="w-full p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 font-black text-emerald-600 text-right">
                            {(it.quantity * it.unitPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t-2 border-slate-100 dark:border-slate-700 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Grand Total</p>
                  <p className="text-5xl font-black text-emerald-500 tracking-tighter">PKR {calculateTotal(selectedItems).toLocaleString()}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 md:flex-none px-8 py-5 text-slate-400 font-black uppercase text-xs tracking-widest">Cancel</button>
                   <button type="submit" className="flex-1 md:flex-none px-12 py-5 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/30 active:scale-95 transition-all">
                     {editingInvoiceId ? 'Update Record' : 'Save & Close'}
                   </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
