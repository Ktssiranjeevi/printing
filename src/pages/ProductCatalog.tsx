import { useState } from 'react';
import { Link } from 'react-router';
import ProductSidebar from '../components/ProductSidebar';
import ProductGrid from '../components/ProductGrid';
import AppShell from '../components/layout/AppShell';
import PageIntro from '../components/layout/PageIntro';
import { useAppData } from '../contexts/AppDataContext';

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('All products');
  const { products, categories } = useAppData();

  return (
    <AppShell activeTab="Product catalog">
      <PageIntro
        title="Product catalog"
        description="Browse all categories, compare products, and open a product detail page from the catalog."
        action={(
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Back to home
          </Link>
        )}
      />
      <div className="flex flex-col gap-6 lg:flex-row">
        <ProductSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <div className="flex-1 rounded-[32px] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Catalog view</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedCategory}</h2>
            </div>
            <p className="text-sm text-slate-500">Select a product to open its detail page.</p>
          </div>
          {products.length > 0 ? (
            <ProductGrid products={products} selectedCategory={selectedCategory} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="text-2xl font-bold text-slate-900">No products in the database</h3>
              <p className="mt-3 text-sm text-slate-600">
                Open the admin app to add your first product and it will appear here automatically.
              </p>
              <a
                href="/admin.html"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white"
              >
                Open admin app
              </a>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
