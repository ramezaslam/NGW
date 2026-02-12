
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlassItem, Invoice, GlassService, InvoiceStatus, Worker, DocumentType } from '../types';
import { MOCK_INVENTORY, MOCK_INVOICES, MOCK_SERVICES } from '../constants';

interface AppContextType {
  inventory: GlassItem[];
  invoices: Invoice[];
  services: GlassService[];
  workers: Worker[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addInventoryItem: (item: Omit<GlassItem, 'id'>) => void;
  updateInventoryItem: (item: GlassItem) => void;
  deleteInventoryItem: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  assignWorkerToInvoice: (invoiceId: string, workerId: string) => void;
  convertToInvoice: (id: string) => void;
  addService: (service: Omit<GlassService, 'id'>) => void;
  deleteService: (id: string) => void;
  addWorker: (worker: Omit<Worker, 'id' | 'status'>) => void;
  updateWorker: (worker: Worker) => void;
  deleteWorker: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('glasspro_auth') === 'true';
  });

  const [inventory, setInventory] = useState<GlassItem[]>(() => {
    const saved = localStorage.getItem('glass_inventory');
    return saved ? JSON.parse(saved) : MOCK_INVENTORY.map(item => ({ ...item, thicknessMM: item.thicknessMM || 5 }));
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('glass_invoices');
    return saved ? JSON.parse(saved) : MOCK_INVOICES.map(inv => ({ ...inv, docType: inv.docType || 'INVOICE' }));
  });

  const [services, setServices] = useState<GlassService[]>(() => {
    const saved = localStorage.getItem('glass_services');
    return saved ? JSON.parse(saved) : MOCK_SERVICES;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('glass_workers');
    const defaultWorkers: Worker[] = [
      { id: 'w1', name: 'John Doe', phone: '555-0101', role: 'Installer', status: 'Available' },
      { id: 'w2', name: 'Mike Smith', phone: '555-0102', role: 'Cutter', status: 'On Duty' },
      { id: 'w3', name: 'Danish', phone: '0300-1234567', role: 'Installer', status: 'Available' }
    ];
    return saved ? JSON.parse(saved) : defaultWorkers;
  });

  useEffect(() => {
    localStorage.setItem('glasspro_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('glass_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('glass_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('glass_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('glass_workers', JSON.stringify(workers));
  }, [workers]);

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addInventoryItem = (item: Omit<GlassItem, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setInventory([...inventory, newItem]);
  };

  const updateInventoryItem = (updatedItem: GlassItem) => {
    setInventory(inventory.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const prefix = invoice.docType === 'QUOTATION' ? 'QT' : 'INV';
    const invNum = `${prefix}-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const newInvoice = { ...invoice, id: Math.random().toString(36).substr(2, 9), invoiceNumber: invNum };
    setInvoices([newInvoice, ...invoices]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  const convertToInvoice = (id: string) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          docType: 'INVOICE' as DocumentType,
          invoiceNumber: inv.invoiceNumber.replace('QT', 'INV'),
          status: InvoiceStatus.UNPAID
        };
      }
      return inv;
    }));
  };

  const assignWorkerToInvoice = (invoiceId: string, workerId: string) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, assignedWorkerId: workerId } : inv));
    if (workerId) {
      setWorkers(workers.map(w => w.id === workerId ? { ...w, status: 'On Duty' } : w));
    }
  };

  const addService = (service: Omit<GlassService, 'id'>) => {
    const newService = { ...service, id: Math.random().toString(36).substr(2, 9) };
    setServices([...services, newService]);
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const addWorker = (worker: Omit<Worker, 'id' | 'status'>) => {
    const newWorker: Worker = { ...worker, id: Math.random().toString(36).substr(2, 9), status: 'Available' };
    setWorkers([...workers, newWorker]);
  };

  const updateWorker = (updatedWorker: Worker) => {
    setWorkers(workers.map(w => w.id === updatedWorker.id ? updatedWorker : w));
  };

  const deleteWorker = (id: string) => {
    setWorkers(workers.filter(w => w.id !== id));
  };

  return (
    <AppContext.Provider value={{
      inventory, invoices, services, workers, isAuthenticated, login, logout,
      addInventoryItem, updateInventoryItem, deleteInventoryItem,
      addInvoice, updateInvoice, updateInvoiceStatus, assignWorkerToInvoice, convertToInvoice,
      addService, deleteService,
      addWorker, updateWorker, deleteWorker
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
