
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate network delay for premium feel
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid workshop credentials. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Industrial Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40 rotate-12">
            <span className="material-icons-round text-white text-5xl">precision_manufacturing</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">GlassPro <span className="text-emerald-500">Manager</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Inventory & Sales Control System</p>
        </div>

        <div className="bg-white/5 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Username</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">person</span>
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">lock</span>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold">
                <span className="material-icons-round text-sm">error</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-icons-round text-lg">login</span>
                  Secure Entry
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact support if credentials lost</p>
            <p className="text-[9px] font-bold text-slate-600 mt-2">© 2024 Industrial Solutions Group</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
