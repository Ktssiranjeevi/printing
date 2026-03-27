import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { sampleProducts, type Product } from '../data/products';
import { storefrontCategories } from '../data/categories';
import type { CartItem } from './CartContext';

export type OrderStatus = 'Delivered' | 'Dispatched' | 'Processing';

export interface OrderRecord {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
}

interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface AppDataContextType {
  products: Product[];
  orders: OrderRecord[];
  categories: string[];
  addProduct: (product: Omit<Product, 'id' | 'uid'> & { id?: string; uid?: string }) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createOrder: (input: CreateOrderInput) => OrderRecord;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const defaultOrders: OrderRecord[] = [
  {
    id: 'ORD-101',
    date: '2026-03-11',
    status: 'Delivered',
    total: 2299,
    itemCount: 2,
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    items: [],
  },
  {
    id: 'ORD-102',
    date: '2026-03-13',
    status: 'Dispatched',
    total: 1499,
    itemCount: 1,
    customerName: 'Priya Nair',
    customerEmail: 'priya@example.com',
    items: [],
  },
];

const PRODUCTS_STORAGE_KEY = 'product-customizer-products';
const ORDERS_STORAGE_KEY = 'product-customizer-orders';

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    stock: typeof product.stock === 'number' ? product.stock : 0,
    status: product.status || 'Active',
  };
}

function normalizeOrderStatus(status: OrderRecord['status'] | 'In Transit'): OrderStatus {
  if (status === 'In Transit') {
    return 'Dispatched';
  }

  return status;
}

function normalizeOrder(order: OrderRecord): OrderRecord {
  return {
    ...order,
    status: normalizeOrderStatus(order.status),
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage(PRODUCTS_STORAGE_KEY, sampleProducts).map(normalizeProduct),
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStorage(ORDERS_STORAGE_KEY, defaultOrders).map(normalizeOrder),
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PRODUCTS_STORAGE_KEY) {
        setProducts(readStorage(PRODUCTS_STORAGE_KEY, sampleProducts).map(normalizeProduct));
      }

      if (event.key === ORDERS_STORAGE_KEY) {
        setOrders(readStorage(ORDERS_STORAGE_KEY, defaultOrders).map(normalizeOrder));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addProduct: AppDataContextType['addProduct'] = (product) => {
    const normalizedName = product.name.trim();
    const normalizedId = product.id?.trim() || String(Date.now());
    const normalizedUid = product.uid?.trim() || `${slugify(normalizedName)}-${normalizedId}`;

    const nextProduct: Product = {
      ...product,
      id: normalizedId,
      uid: normalizedUid,
      name: normalizedName,
      stock: typeof product.stock === 'number' ? product.stock : 0,
      status: product.status || 'Active',
    };

    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
  };

  const updateProduct: AppDataContextType['updateProduct'] = (id, updates) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === id ? { ...product, ...updates } : product)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
  };

  const createOrder = (input: CreateOrderInput) => {
    const nextOrder: OrderRecord = {
      id: `ORD-${100 + orders.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Processing',
      total: input.total,
      itemCount: input.itemCount,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      items: input.items,
    };

    setOrders((currentOrders) => [nextOrder, ...currentOrders]);
    return nextOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  const categories = useMemo(
    () => [...new Set([...storefrontCategories, ...products.map((product) => product.category)])],
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      orders,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      createOrder,
      updateOrderStatus,
    }),
    [categories, orders, products],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }

  return context;
}
