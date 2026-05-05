import { LowStockItem } from './types';

export const LOW_STOCK_ITEMS: LowStockItem[] = [
  { name: 'Whole Milk 1L',           category: 'Dairy',            stock: 12,  status: 'critical' },
  { name: 'House Blend Beans (5kg)', category: 'Coffee',           stock: 2,   status: 'critical' },
  { name: 'Paper Cups (Medium)',      category: 'Supplies',         stock: 150, status: 'low' },
  { name: 'Oat Milk 1L',             category: 'Dairy Alternative',stock: 8,   status: 'low' },
];
