import { useMemo, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAppData } from '../contexts/AppDataContext';
import { productCategories } from '../data/categories';

interface CategoriesPageProps {
  initialCategory?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CategoriesPage({ initialCategory = 'all' }: CategoriesPageProps) {
  const { products } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const productsByCategory = useMemo(() => {
    const grouped = new Map<string, typeof products>();

    products.forEach((product) => {
      const currentGroup = grouped.get(product.category) ?? [];
      grouped.set(product.category, [...currentGroup, product]);
    });

    return grouped;
  }, [products]);

  const visibleCategories = useMemo(() => {
    const available = Array.from(productsByCategory.keys()).sort();
    if (selectedCategory === 'all') {
      return available;
    }

    return available.filter((category) => category === selectedCategory);
  }, [productsByCategory, selectedCategory]);

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Products by category</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Browse all products grouped into categories, switch category filters instantly, and review product information including name, price, stock, and current status.
        </p>
      </div>

      <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Category filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300' : 'rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-slate-900'}
            >
              All Categories
            </Button>
            {productCategories.map((category) => (
              <Button
                key={category}
                type="button"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300' : 'rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-slate-900'}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {visibleCategories.map((category) => {
          const categoryProducts = productsByCategory.get(category) ?? [];

          return (
            <Card key={category} className="border-slate-200 bg-white text-slate-900 shadow-sm">
              <CardHeader className="border-b border-slate-200">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-900">{category}</CardTitle>
                    <p className="mt-2 text-sm text-slate-500">
                      {categoryProducts.length} product{categoryProducts.length === 1 ? '' : 's'} in this category
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                    Category inventory: <span className="font-semibold text-slate-900">{categoryProducts.reduce((sum, product) => sum + product.stock, 0)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {categoryProducts.map((product) => (
                    <article key={product.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                      <div className="aspect-[4/3] overflow-hidden border-b border-slate-200 bg-white">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg font-semibold leading-6 text-slate-900">{product.name}</h4>
                            <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
                          </div>
                          <Badge className={product.status === 'Active' ? 'border-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : product.status === 'Draft' ? 'border-0 bg-amber-100 text-amber-800 hover:bg-amber-100' : 'border-0 bg-slate-200 text-slate-700 hover:bg-slate-200'}>
                            {product.status}
                          </Badge>
                        </div>

                        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600 sm:grid-cols-2">
                          <p>Name: <span className="font-medium text-slate-900">{product.name}</span></p>
                          <p>Price: <span className="font-medium text-slate-900">{formatCurrency(product.price)}</span></p>
                          <p>Stock: <span className="font-medium text-slate-900">{product.stock}</span></p>
                          <p>Status: <span className="font-medium text-slate-900">{product.status}</span></p>
                        </div>

                        <p className="text-sm leading-6 text-slate-600">{product.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {visibleCategories.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No products are available in this category right now.
          </div>
        )}
      </div>
    </div>
  );
}
