import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CheckCircle2,
  DollarSign,
  Filter,
  Layers3,
  Package,
  ShoppingCart,
  TimerReset,
  Truck,
} from 'lucide-react';
import {
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAppData, type OrderStatus } from '../contexts/AppDataContext';
import type { Product } from '../data/products';
import { productCategories } from '../data/categories';
import type { AdminNavigationPreset, TimeFilter } from './adminViewTypes';

const filterLabels: Record<TimeFilter, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
  custom: 'Custom',
};

const chartColors = ['#38bdf8', '#f59e0b', '#60a5fa', '#34d399'];

interface EnhancedDashboardPageProps {
  onNavigate: (preset: AdminNavigationPreset) => void;
}

function getFilterStartDate(timeFilter: TimeFilter) {
  const now = new Date();

  switch (timeFilter) {
    case 'daily':
      return startOfDay(now);
    case 'weekly':
      return startOfWeek(now);
    case 'monthly':
      return startOfMonth(now);
    case 'yearly':
      return startOfYear(now);
    case 'custom':
      return null;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function getOrderCategories(order: ReturnType<typeof useAppData>['orders'][number], products: ReturnType<typeof useAppData>['products']) {
  const productLookup = new Map(products.map((product) => [product.id, product]));

  return new Set(
    order.items
      .map((item) => productLookup.get(item.id)?.category)
      .filter((category): category is string => Boolean(category)),
  );
}

export default function EnhancedDashboardPage({ onNavigate }: EnhancedDashboardPageProps) {
  const { products, orders } = useAppData();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | Product['status']>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchableText = [product.name, product.brand, product.category, product.uid].join(' ').toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' || searchableText.includes(searchQuery.trim().toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = productStatusFilter === 'all' || product.status === productStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, productStatusFilter, products, searchQuery]);

  const filteredOrders = useMemo(() => {
    const startDate = getFilterStartDate(timeFilter);

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const searchableText = [order.id, order.customerName, order.customerEmail, order.status].join(' ').toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' || searchableText.includes(searchQuery.trim().toLowerCase());
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesRelativeRange =
        startDate === null || isAfter(orderDate, startDate) || isEqual(orderDate, startDate);
      const matchesDateFrom = dateFrom === '' || !isBefore(orderDate, new Date(dateFrom));
      const matchesDateTo = dateTo === '' || !isAfter(orderDate, new Date(dateTo));
      const orderCategories = getOrderCategories(order, products);
      const matchesCategory =
        categoryFilter === 'all' ||
        orderCategories.size === 0 ||
        orderCategories.has(categoryFilter);

      return matchesSearch && matchesStatus && matchesRelativeRange && matchesDateFrom && matchesDateTo && matchesCategory;
    });
  }, [categoryFilter, dateFrom, dateTo, orderStatusFilter, orders, products, searchQuery, timeFilter]);

  const metrics = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const totalOrders = filteredOrders.length;
    const processingOrders = filteredOrders.filter((order) => order.status === 'Processing').length;
    const dispatchedOrders = filteredOrders.filter((order) => order.status === 'Dispatched').length;
    const deliveredOrders = filteredOrders.filter((order) => order.status === 'Delivered').length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const orderRevenue = filteredOrders
      .filter((order) => order.status === 'Delivered')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalProducts,
      totalOrders,
      processingOrders,
      dispatchedOrders,
      deliveredOrders,
      totalRevenue,
      orderRevenue,
    };
  }, [filteredOrders, filteredProducts]);

  const chartData = useMemo(
    () => [
      { name: 'Total Orders', value: metrics.totalOrders },
      { name: 'Processing', value: metrics.processingOrders },
      { name: 'Dispatched', value: metrics.dispatchedOrders },
      { name: 'Delivered', value: metrics.deliveredOrders },
    ],
    [metrics],
  );

  const statCards = [
    {
      label: 'Total Products',
      value: metrics.totalProducts,
      helper: 'Click to open the full product list',
      icon: Layers3,
      onClick: () =>
        onNavigate({
          section: 'products',
          category: categoryFilter,
          productStatus: productStatusFilter,
          search: searchQuery,
        }),
    },
    {
      label: 'Total Orders',
      value: metrics.totalOrders,
      helper: `${filterLabels[timeFilter]} filtered order volume`,
      icon: ShoppingCart,
      onClick: () =>
        onNavigate({
          section: 'orders',
          category: categoryFilter,
          orderStatus: orderStatusFilter,
          dateFrom,
          dateTo,
          search: searchQuery,
        }),
    },
    {
      label: 'Orders In Processing',
      value: metrics.processingOrders,
      helper: 'Click to view processing orders',
      icon: TimerReset,
      onClick: () =>
        onNavigate({
          section: 'orders',
          category: categoryFilter,
          orderStatus: 'Processing',
          dateFrom,
          dateTo,
          search: searchQuery,
        }),
    },
    {
      label: 'Orders Dispatched',
      value: metrics.dispatchedOrders,
      helper: 'Click to view dispatched orders',
      icon: Truck,
      onClick: () =>
        onNavigate({
          section: 'orders',
          category: categoryFilter,
          orderStatus: 'Dispatched',
          dateFrom,
          dateTo,
          search: searchQuery,
        }),
    },
    {
      label: 'Orders Delivered',
      value: metrics.deliveredOrders,
      helper: 'Click to view delivered orders',
      icon: CheckCircle2,
      onClick: () =>
        onNavigate({
          section: 'orders',
          category: categoryFilter,
          orderStatus: 'Delivered',
          dateFrom,
          dateTo,
          search: searchQuery,
        }),
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      helper: 'Click to open revenue-related order results',
      icon: DollarSign,
      onClick: () =>
        onNavigate({
          section: 'orders',
          category: categoryFilter,
          orderStatus: orderStatusFilter,
          dateFrom,
          dateTo,
          search: searchQuery,
        }),
    },
    {
      label: 'Order-Based Revenue',
      value: formatCurrency(metrics.orderRevenue),
      helper: 'Click to view delivered revenue orders',
      icon: Package,
      onClick: () =>
        onNavigate({
          section: 'orders',
          category: categoryFilter,
          orderStatus: 'Delivered',
          dateFrom,
          dateTo,
          search: searchQuery,
        }),
    },
  ];

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Operational dashboard</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Every main card is clickable now. Use the full filters below, then click a card to open the matching product, order, or category view with those filters carried through.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2">
          {(['daily', 'weekly', 'monthly', 'yearly', 'custom'] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              type="button"
              variant={timeFilter === filter ? 'default' : 'ghost'}
              onClick={() => setTimeFilter(filter)}
              className={
                timeFilter === filter
                  ? 'rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'rounded-2xl text-slate-600 hover:bg-white hover:text-slate-900'
              }
            >
              {filterLabels[filter]}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Filter className="h-5 w-5 text-amber-600" />
            Dashboard filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_200px_200px_200px_180px_180px]">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products, orders, customer names, email, or UID"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
          >
            <option value="all">All categories</option>
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={orderStatusFilter}
            onChange={(event) => setOrderStatusFilter(event.target.value as 'all' | OrderStatus)}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
          >
            <option value="all">All order statuses</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select
            value={productStatusFilter}
            onChange={(event) => setProductStatusFilter(event.target.value as 'all' | Product['status'])}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
          >
            <option value="all">All product statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {statCards.map(({ label, value, helper, icon: Icon, onClick }) => (
          <button key={label} type="button" onClick={onClick} className="text-left">
            <Card className="h-full border-slate-200 bg-white text-slate-900 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md">
              <CardContent className="flex h-full items-start justify-between gap-4 p-5">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
                </div>
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Order status bar chart</CardTitle>
            <p className="text-sm text-slate-500">
              Comparing total order volume against processing, dispatched, and delivered counts for the selected filters.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={42}>
                  <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(15,23,42,0.04)' }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(148,163,184,0.2)',
                      borderRadius: '16px',
                      color: '#0f172a',
                    }}
                  />
                  <Bar dataKey="value" radius={[14, 14, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Filtered overview</CardTitle>
            <p className="text-sm text-slate-500">Quick snapshot of your current search, category, date, and status filters.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Matching products</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{filteredProducts.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Matching orders</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{filteredOrders.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Current category filter</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{categoryFilter === 'all' ? 'All categories' : categoryFilter}</p>
            </div>
            <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Navigation tip</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Click any metric card above to open the matching admin page with the active filters already applied.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
