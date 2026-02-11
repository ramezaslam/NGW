
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Worker } from '../types';

const Workers: React.FC = () => {
  const { workers, addWorker, updateWorker, deleteWorker, invoices } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Worker>>({
    name: '',
    phone: '',
    role: 'Helper'
  });

  useEffect(() => {
    const handleGlobalAdd = () => openModal();
    window.addEventListener('glasspro:open-add', handleGlobalAdd);
    return () => window.removeEventListener('glasspro:open-add', handleGlobalAdd);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorker) {
      updateWorker({ ...editingWorker, ...formData } as Worker);
    } else {
      addWorker(formData as Omit<Worker, 'id' | 'status'>);
    }
    closeModal();
  };

  const openModal = (worker?: Worker) => {
    if (worker) {
      setEditingWorker(worker);
      setFormData(worker);
    } else {
      setEditingWorker(null);
      setFormData({ name: '', phone: '', role: 'Helper' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorker(null);
  };

  const getWorkerAssignedJobs = (workerId: string) => {
    return invoices.filter(inv => inv.assignedWorkerId === workerId && inv.status !== 'PAID');
  };

  return (
    <div className="px-6 py-6 space-y-8">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Technical Staff</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Management of workshop personnel</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform shadow-xl shadow-emerald-500/30"
        >
          <span className="material-icons-round text-sm">person_add</span> Register Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => {
          const activeJobs = getWorkerAssignedJobs(worker.id);
          return (
            <div key={worker.id} className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-50 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-5 mb-6 relative z-10">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner rotate-3 group-hover:rotate-0 transition-transform ${
                  worker.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                  worker.status === 'On Duty' ? 'bg-amber-50 text-amber-600' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {worker.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-800 dark:text-white text-xl tracking-tight leading-none">{worker.name}</h4>
                    {worker.name === 'Danish' && <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">Pro</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{worker.role}</p>
                  <div className={`mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ${
                    worker.status === 'Available' ? 'bg-emerald-500 text-white' :
                    worker.status === 'On Duty' ? 'bg-amber-500 text-white' :
                    'bg-slate-400 text-white'
                  }`}>
                    {worker.status}
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                   <span className="material-icons-round text-lg opacity-50">phone</span>
                   <span className="text-sm font-bold">{worker.phone}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ongoing Assignments ({activeJobs.length})</p>
                  {activeJobs.length > 0 ? (
                    <div className="space-y-2">
                      {activeJobs.slice(0, 2).map(job => (
                        <div key={job.id} className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          {job.clientName} - {job.invoiceNumber}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] italic text-slate-400 font-medium">Currently free for new tasks</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-8">
                 <button onClick={() => openModal(worker)} className="flex-1 py-3 bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:text-emerald-500 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
                  <span className="material-icons-round text-sm">edit</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Update</span>
                </button>
                <button onClick={() => deleteWorker(worker.id)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 rounded-2xl transition-all active:scale-90">
                  <span className="material-icons-round">delete</span>
                </button>
              </div>

              <div className="absolute -right-6 -top-6 text-slate-50 dark:text-slate-700/20 group-hover:text-emerald-500/10 transition-colors duration-700">
                <span className="material-icons-round text-[10rem]">engineering</span>
              </div>
            </div>
          )
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-3xl font-black mb-8 text-slate-800 dark:text-white tracking-tighter uppercase">{editingWorker ? 'Edit Staff Profile' : 'Technical Registration'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Legal Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Danish Ali"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Phone Contact</label>
                <input 
                  required
                  type="tel" 
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+92 300 1234567"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Specialization Role</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-black dark:text-white uppercase tracking-tighter"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="Cutter">Precision Glass Cutter</option>
                  <option value="Installer">Senior Installer / Fitter</option>
                  <option value="Polisher">Edging & Polishing Expert</option>
                  <option value="Helper">General Workshop Helper</option>
                </select>
              </div>
              {editingWorker && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Current Availability Status</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-black dark:text-white uppercase tracking-tighter"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Available">Available for Work</option>
                    <option value="On Duty">Currently on Job Duty</option>
                    <option value="Off">Off Work / Leave</option>
                  </select>
                </div>
              )}
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={closeModal} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">Dismiss</button>
                <button type="submit" className="flex-2 px-10 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">
                  {editingWorker ? 'Update Records' : 'Complete Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workers;
