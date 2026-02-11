
export enum InvoiceStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE',
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING APPROVAL'
}

export type DocumentType = 'QUOTATION' | 'INVOICE';

export type ProductCategory = 'Plain Glass' | 'Mirror' | 'Toughened' | 'Tinted' | 'Aluminum Section' | 'Aluminum Hardware' | 'Silicon/Rubber';

export interface GlassItem {
  id: string;
  name: string;
  sku: string;
  thicknessMM?: number;
  costPrice: number; // For Profit/Loss calculation
  pricePerSqFt: number; // Selling price
  stock: number;
  unit: 'sq ft' | 'ft' | 'kg' | 'pc';
  category: ProductCategory;
  image: string;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  role: 'Cutter' | 'Installer' | 'Polisher' | 'Helper' | 'Aluminum Fabricator';
  status: 'Available' | 'On Duty' | 'Off';
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  costPriceAtTime: number; // To track profit even if item prices change later
  type: 'glass' | 'aluminum' | 'service';
  width?: number;
  height?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  date: string;
  items: InvoiceLineItem[];
  amount: number;
  status: InvoiceStatus;
  assignedWorkerId?: string;
  docType: DocumentType;
}

export interface GlassService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  icon: string;
}
