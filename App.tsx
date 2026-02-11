
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Invoices from './components/Invoices';
import Services from './components/Services';
import Workers from './components/Workers'; // Import new component
import { AppProvider } from './context/AppContext';

const AppContent: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/inventory': return 'Inventory';
      case '/invoices': return 'Sales & Invoices';
      case '/services': return 'Our Services';
      case '/workers': return 'Worker Management';
      case '/settings': return 'Settings';
      default: return 'GlassPro';
    }
  };

  return (
    <Layout title={getPageTitle()}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/services" element={<Services />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/settings" element={
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 space-y-4">
            <span className="material-icons-round text-6xl">construction</span>
            <p className="font-medium">Settings coming soon...</p>
          </div>
        } />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
