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
  Layers3,
  Package,
  ShoppingCart,
  TimerReset,
  Truck,
} from 'lucide-react';
import { isAfter, isEqual, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAppData } from '../contexts/AppDataContext';

type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

const filterLabels: Record<TimeFilter, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const chartColors = ['#38bdf8', '#f59e0b', '#60a5fa', '#34d399'];

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
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const { products, orders } = useAppData();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');

  const filteredOrders = useMemo(() => {
    const startDate = getFilterStartDate(timeFilter);

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return isAfter(orderDate, startDate) || isEqual(orderDate, startDate);
    });
  }, [orders, timeFilter]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
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
  }, [filteredOrders, products.length]);

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
      helper: 'Catalog items available in admin',
      icon: Layers3,
    },
    {
      label: 'Total Orders',
      value: metrics.totalOrders,
      helper: `${filterLabels[timeFilter]} order volume`,
      icon: ShoppingCart,
    },
    {
      label: 'Orders In Processing',
      value: metrics.processingOrders,
      helper: 'Awaiting production or packing',
      icon: TimerReset,
    },
    {
      label: 'Orders Dispatched',
      value: metrics.dispatchedOrders,
      helper: 'Already shipped to customers',
      icon: Truck,
    },
    {
      label: 'Orders Delivered',
      value: metrics.deliveredOrders,
      helper: 'Completed fulfillment',
      icon: CheckCircle2,
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      helper: `Revenue across ${filterLabels[timeFilter].toLowerCase()} orders`,
      icon: DollarSign,
    },
    {
      label: 'Order-Based Revenue',
      value: formatCurrency(metrics.orderRevenue),
      helper: 'Revenue from delivered orders only',
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Operational dashboard</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Monitor your product count, order pipeline, dispatch progress, delivery completion, and revenue trends with a selectable reporting window.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2">
          {(Object.keys(filterLabels) as TimeFilter[]).map((filter) => (
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

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {statCards.map(({ label, value, helper, icon: Icon }) => (
          <Card key={label} className="border-slate-200 bg-white text-slate-900 shadow-sm">
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
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Order status bar chart</CardTitle>
            <p className="text-sm text-slate-500">
              Comparing total order volume against processing, dispatched, and delivered counts for the selected range.
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
            <CardTitle className="text-slate-900">Fulfillment health</CardTitle>
            <p className="text-sm text-slate-500">A quick operational breakdown for the active reporting window.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: 'Processing share',
                value: metrics.totalOrders === 0 ? 0 : Math.round((metrics.processingOrders / metrics.totalOrders) * 100),
                tone: 'from-amber-400/30 to-amber-500/5',
              },
              {
                label: 'Dispatch share',
                value: metrics.totalOrders === 0 ? 0 : Math.round((metrics.dispatchedOrders / metrics.totalOrders) * 100),
                tone: 'from-sky-400/30 to-sky-500/5',
              },
              {
                label: 'Delivery share',
                value: metrics.totalOrders === 0 ? 0 : Math.round((metrics.deliveredOrders / metrics.totalOrders) * 100),
                tone: 'from-emerald-400/30 to-emerald-500/5',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-600">{item.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{item.value}%</p>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Revenue note</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Total revenue reflects all filtered orders, while order-based revenue focuses only on orders marked as delivered.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
