
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Invoices from './components/Invoices';
import Services from './components/Services';
import Workers from './components/Workers';
import Settings from './components/Settings';
import Login from './components/Login';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Login />;
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Workshop Dashboard';
      case '/inventory': return 'Stock Inventory';
      case '/invoices': return 'Sales & Invoices';
      case '/services': return 'Business Services';
      case '/workers': return 'Personnel Management';
      case '/settings': return 'System Settings';
      default: return 'GlassPro Manager';
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
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
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
