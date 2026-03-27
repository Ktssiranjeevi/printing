import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Filter, Search, Truck } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAppData, type OrderStatus } from '../contexts/AppDataContext';
import { productCategories } from '../data/categories';

interface OrdersManagementPageProps {
  initialStatusFilter?: 'all' | OrderStatus;
  initialCategoryFilter?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialSearchQuery?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function isWithinRange(date: string, from: string, to: string) {
  if (from && date < from) {
    return false;
  }

  if (to && date > to) {
    return false;
  }

  return true;
}

export default function OrdersManagementPage({
  initialStatusFilter = 'all',
  initialCategoryFilter = 'all',
  initialDateFrom = '',
  initialDateTo = '',
  initialSearchQuery = '',
}: OrdersManagementPageProps) {
  const { orders, products, updateOrderStatus } = useAppData();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
    setStatusFilter(initialStatusFilter);
    setCategoryFilter(initialCategoryFilter);
    setDateFrom(initialDateFrom);
    setDateTo(initialDateTo);
  }, [initialCategoryFilter, initialDateFrom, initialDateTo, initialSearchQuery, initialStatusFilter]);

  const productLookup = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchableText = [order.id, order.customerName, order.customerEmail, order.status].join(' ').toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' || searchableText.includes(searchQuery.trim().toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesDate = isWithinRange(order.date, dateFrom, dateTo);
      const orderCategories = new Set(
        order.items
          .map((item) => productLookup.get(item.id)?.category)
          .filter((category): category is string => Boolean(category)),
      );
      const matchesCategory =
        categoryFilter === 'all' ||
        orderCategories.size === 0 ||
        orderCategories.has(categoryFilter);

      return matchesSearch && matchesStatus && matchesDate && matchesCategory;
    });
  }, [categoryFilter, dateFrom, dateTo, orders, productLookup, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Orders management</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Review every order with searchable filters for customer, status, date range, and related product category.
        </p>
      </div>

      <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Filter className="h-5 w-5 text-amber-600" />
            Order filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_220px_220px_180px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by order ID, customer, or email"
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | OrderStatus)}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
          >
            <option value="all">All statuses</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
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
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Filtered orders</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{filteredOrders.length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Filtered revenue</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.total, 0))}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Date window</p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {dateFrom || 'Start'} to {dateTo || 'Now'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-slate-200 bg-white text-slate-900 shadow-sm">
            <CardContent className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_180px_180px] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-lg font-semibold text-slate-900">{order.id}</h4>
                  <Badge
                    className={
                      order.status === 'Delivered'
                        ? 'border-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                        : order.status === 'Dispatched'
                          ? 'border-0 bg-sky-100 text-sky-800 hover:bg-sky-100'
                          : 'border-0 bg-amber-100 text-amber-800 hover:bg-amber-100'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                  <p>Customer: <span className="font-medium text-slate-900">{order.customerName}</span></p>
                  <p>Email: <span className="font-medium text-slate-900">{order.customerEmail}</span></p>
                  <p>Date: <span className="font-medium text-slate-900">{order.date}</span></p>
                  <p>Items: <span className="font-medium text-slate-900">{order.itemCount}</span></p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">Order total</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(order.total)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-slate-400" />
                <select
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card className="border-dashed border-slate-300 bg-slate-50 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <CalendarDays className="h-10 w-10 text-slate-400" />
              <p className="text-sm text-slate-500">No orders matched the current filter set.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
