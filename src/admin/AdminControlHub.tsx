import { useMemo, useState } from 'react';
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Layers3,
  LogOut,
  PackageCheck,
  PackageSearch,
  ShoppingBag,
} from 'lucide-react';
import { AppDataProvider, useAppData } from '../contexts/AppDataContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import AdminLogin from './AdminLogin';
import EnhancedDashboardPage from './EnhancedDashboardPage';
import OrdersManagementPage from './OrdersManagementPage';
import ProductManagementPage from './ProductManagementPage';
import CategoriesPage from './CategoriesPage';
import type { AdminNavigationPreset, AdminSection } from './adminViewTypes';
import '../styles/index.css';

const sections: Array<{
  id: AdminSection;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Track orders, revenue, and fulfillment health',
    icon: LayoutDashboard,
  },
  {
    id: 'products',
    label: 'Product Management',
    description: 'Add, edit, delete, and search your catalog',
    icon: PackageSearch,
  },
  {
    id: 'orders',
    label: 'Orders',
    description: 'Review all orders with advanced filters',
    icon: PackageCheck,
  },
  {
    id: 'categories',
    label: 'Categories',
    description: 'Review products grouped by category',
    icon: Layers3,
  },
];

function AdminDashboard() {
  const { adminUser } = useAuth();

  if (!adminUser) {
    return <AdminLogin />;
  }

  return <AdminDashboardContent adminUserName={adminUser.name} />;
}

function AdminDashboardContent({ adminUserName }: { adminUserName: string }) {
  const { products, orders } = useAppData();
  const { logoutAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [navigationPreset, setNavigationPreset] = useState<AdminNavigationPreset>({ section: 'dashboard' });

  const activeSectionMeta = sections.find((section) => section.id === activeSection) ?? sections[0];

  const quickStats = useMemo(
    () => [
      { label: 'Products', value: products.length, icon: Boxes },
      { label: 'Orders', value: orders.length, icon: ShoppingBag },
      {
        label: 'Delivered',
        value: orders.filter((order) => order.status === 'Delivered').length,
        icon: BarChart3,
      },
    ],
    [orders, products.length],
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:w-[320px] lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col p-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-amber-600">Admin panel</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Commerce Control Hub</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A focused workspace for tracking order momentum, managing your catalog, reviewing filters, and drilling into details from the dashboard.
              </p>
            </div>

            <nav className="mt-6 grid gap-3">
              {sections.map(({ id, label, description, icon: Icon }) => {
                const isActive = activeSection === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveSection(id);
                      setNavigationPreset({ section: id });
                    }}
                    className={`rounded-[24px] border p-4 text-left transition ${
                      isActive
                        ? 'border-amber-300 bg-amber-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-2xl p-3 ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{label}</p>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 grid gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workspace snapshot</p>
              {quickStats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
                  </div>
                  <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Signed in as</p>
                    <p className="mt-1 font-medium text-slate-900">{adminUserName}</p>
                  </div>
                  <Badge className="border-0 bg-amber-100 px-3 py-1 text-amber-800 hover:bg-amber-100">
                    Live
                  </Badge>
                </div>
                <div className="mt-4 flex gap-3">
                  <a
                    href="/"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-amber-50"
                  >
                    Open storefront
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-slate-200 bg-transparent px-4 text-slate-700 hover:bg-amber-50 hover:text-slate-950"
                    onClick={logoutAdmin}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Section overview</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{activeSectionMeta.label}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{activeSectionMeta.description}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-sm text-slate-500">Total active inventory</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {products.filter((product) => product.status === 'Active').length} products live
                </p>
              </div>
            </div>

            {activeSection === 'dashboard' && (
              <EnhancedDashboardPage
                onNavigate={(preset) => {
                  setNavigationPreset(preset);
                  setActiveSection(preset.section);
                }}
              />
            )}
            {activeSection === 'products' && (
              <ProductManagementPage
                initialSearchQuery={navigationPreset.search}
                initialCategoryFilter={navigationPreset.category}
                initialStatusFilter={navigationPreset.productStatus}
              />
            )}
            {activeSection === 'orders' && (
              <OrdersManagementPage
                initialSearchQuery={navigationPreset.search}
                initialCategoryFilter={navigationPreset.category}
                initialStatusFilter={navigationPreset.orderStatus}
                initialDateFrom={navigationPreset.dateFrom}
                initialDateTo={navigationPreset.dateTo}
              />
            )}
            {activeSection === 'categories' && (
              <CategoriesPage initialCategory={navigationPreset.category} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminControlHub() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AdminDashboard />
      </AppDataProvider>
    </AuthProvider>
  );
}
