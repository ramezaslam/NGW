
import { GlassItem, Invoice, InvoiceStatus, GlassService } from './types';

export const MOCK_INVENTORY: GlassItem[] = [
  {
    id: '1',
    name: '5 MM Clear Glass',
    sku: 'GLS-5MM-CLR',
    thicknessMM: 5,
    costPrice: 85,
    pricePerSqFt: 135,
    stock: 2500,
    unit: 'sq ft',
    category: 'Plain Glass',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: '8 MM Bronze Tinted',
    sku: 'GLS-8MM-BRZ',
    thicknessMM: 8,
    costPrice: 160,
    pricePerSqFt: 245,
    stock: 800,
    unit: 'sq ft',
    category: 'Tinted',
    image: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'a1',
    name: 'Aluminum Section M-24 (White)',
    sku: 'ALU-M24-WHT',
    costPrice: 195,
    pricePerSqFt: 285,
    stock: 600,
    unit: 'ft',
    category: 'Aluminum Section',
    image: 'https://images.unsplash.com/photo-1533038595767-42977b730594?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'a2',
    name: 'Aluminum Section M-28 (Black)',
    sku: 'ALU-M28-BLK',
    costPrice: 210,
    pricePerSqFt: 310,
    stock: 450,
    unit: 'ft',
    category: 'Aluminum Section',
    image: 'https://images.unsplash.com/photo-1533038595767-42977b730594?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'h1',
    name: 'Silicon Tube (Clear)',
    sku: 'ACC-SIL-CLR',
    costPrice: 380,
    pricePerSqFt: 550,
    stock: 120,
    unit: 'pc',
    category: 'Silicon/Rubber',
    image: 'https://images.unsplash.com/photo-1610444583737-9f2324cb8ff7?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'h2',
    name: 'EPDM Rubber Seal',
    sku: 'ACC-RUB-E',
    costPrice: 15,
    pricePerSqFt: 35,
    stock: 2000,
    unit: 'ft',
    category: 'Silicon/Rubber',
    image: 'https://images.unsplash.com/photo-1610444583737-9f2324cb8ff7?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'h3',
    name: 'Sliding Window Roller',
    sku: 'ALU-HW-ROL',
    costPrice: 85,
    pricePerSqFt: 150,
    stock: 100,
    unit: 'pc',
    category: 'Aluminum Hardware',
    image: 'https://images.unsplash.com/photo-1610444583737-9f2324cb8ff7?auto=format&fit=crop&q=80&w=200'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Alex Anderson',
    date: 'Oct 20, 2024',
    items: [
      { id: 'li1', description: '5 MM Clear Glass (24x36)', quantity: 6, unitPrice: 135, costPriceAtTime: 85, type: 'glass', width: 24, height: 36 }
    ],
    amount: 810.00,
    status: InvoiceStatus.PAID,
    docType: 'INVOICE'
  }
];

export const MOCK_SERVICES: GlassService[] = [
  { id: 's1', name: 'Aluminum Window Fixing', description: 'Expert fitting of aluminum frames.', basePrice: 200, icon: 'grid_view' },
  { id: 's2', name: 'Custom Glass Cutting', description: 'Precision machine cutting.', basePrice: 50, icon: 'content_cut' },
  { id: 's3', name: 'Edge Polishing', description: 'Machine edge grinding and polishing.', basePrice: 35, icon: 'auto_fix_high' }
];
