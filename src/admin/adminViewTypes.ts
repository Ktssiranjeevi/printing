import type { Product } from '../data/products';
import type { OrderStatus } from '../contexts/AppDataContext';

export type AdminSection = 'dashboard' | 'products' | 'orders' | 'categories';
export type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface AdminNavigationPreset {
  section: AdminSection;
  category?: string;
  productStatus?: 'all' | Product['status'];
  orderStatus?: 'all' | OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
