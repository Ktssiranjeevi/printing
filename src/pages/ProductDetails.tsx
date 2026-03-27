import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { CardContent } from '../components/ui/card';
import AppShell from '../components/layout/AppShell';
import SurfaceCard from '../components/layout/SurfaceCard';
import { useDesignTabs } from '../contexts/DesignTabsContext';
import { useAppData } from '../contexts/AppDataContext';
import { getDesignAppUrl } from '../design/getDesignAppUrl';

export default function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { addTab } = useDesignTabs();
  const { products } = useAppData();
  const product = products.find((item) => item.id === productId) ?? products[0];

  if (!product) {
    return (
      <AppShell activeTab="Product catalog">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">No products available</h1>
          <p className="mt-3 text-sm text-slate-600">
            Add a product from the admin app, then return to the catalog.
          </p>
          <Button className="mt-6" onClick={() => navigate('/catalog')}>
            Back to catalog
          </Button>
        </div>
      </AppShell>
    );
  }

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedPreview, setSelectedPreview] = useState(product.image);

  const relatedProducts = useMemo(
    () => products.filter((item) => item.category === product.category && item.id !== product.id),
    [product.category, product.id, products],
  );

  const previewImages = Array.from({ length: 5 }, (_, index) => `${product.image}&view=${index + 1}`);
  const displayPrice = product.offerPrice ?? product.price;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);

  const handleStartDesign = () => {
    const nextTab = addTab(product.name, {
      productId: product.id,
      productImage: product.image,
      productInfo: `${product.name} by ${product.brand}`,
      selectedColor,
      selectedSize,
      layers: [],
      artworkImage: '',
      artworkName: '',
    });

    window.location.assign(getDesignAppUrl(product.id, nextTab.id));
  };

  return (
    <AppShell activeTab="Product catalog" showDesignTabs>
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <button type="button" onClick={() => navigate('/catalog')} className="hover:text-slate-700">
            Product catalog
          </button>
          <ChevronRight className="h-4 w-4" />
          <span>{product.category}</span>
        </div>

        <h1 className="mb-6 text-3xl font-bold text-slate-900">Product catalog</h1>

        <div className="grid gap-8 border-t border-slate-300 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-[76px_1fr]">
            <div className="flex gap-4 md:flex-col">
              {previewImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedPreview(image)}
                  className={`overflow-hidden border ${
                    selectedPreview === image ? 'border-amber-500' : 'border-slate-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    className="h-24 w-20 object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="overflow-hidden border border-slate-300 bg-white">
              <img src={selectedPreview} alt={product.name} className="h-full min-h-[680px] w-full object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-[2rem] font-bold leading-tight text-slate-900">{product.name}</h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm text-slate-700">Technology</p>
                <div className="grid grid-cols-2 gap-3">
                  {product.technology.map((item) => (
                    <button key={item} type="button" className="bg-amber-400 px-4 py-3 text-sm text-slate-900">
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-700">Print technique</p>
                <div className="grid grid-cols-2 gap-3">
                  {product.printTechniques.map((item) => (
                    <button key={item} type="button" className="bg-amber-400 px-4 py-3 text-sm text-slate-900">
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm text-slate-700">Color: {selectedColor}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-9 w-9 border ${
                        selectedColor === color ? 'border-slate-900 ring-2 ring-slate-400' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm text-slate-700">Size: {selectedSize}</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-10 border px-3 py-2 text-sm ${
                        selectedSize === size
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500">Product price</p>
              {product.offerPrice ? (
                <div className="mt-1 flex items-center gap-3">
                  <p className="text-xl font-medium text-slate-400 line-through">{formatPrice(product.price)}</p>
                  <p className="text-2xl font-semibold text-emerald-700">{formatPrice(product.offerPrice)}</p>
                </div>
              ) : (
                <p className="mt-1 text-2xl font-semibold text-slate-700">{formatPrice(product.price)}</p>
              )}
              <p className="mt-2 text-4xl font-bold text-slate-900">
                {formatPrice(displayPrice / 2)}
                <span className="ml-2 text-base font-medium text-slate-500">excl. VAT</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">if placed in the next 44h 26m 12s</p>
            </div>

            <div className="space-y-3">
              <Button className="h-12 w-full rounded-none bg-amber-400 text-slate-900 hover:bg-amber-300" onClick={handleStartDesign}>
                Printed product
              </Button>
              <Button className="h-12 w-full rounded-none bg-amber-400 text-slate-900 hover:bg-amber-300" onClick={handleStartDesign}>
                Add to store
              </Button>
            </div>

            <SurfaceCard className="rounded-none">
              <CardContent className="space-y-4 p-5">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Description</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{product.description}</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Fabrication:</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{product.fabrication}</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Product UID</h4>
                  <p className="mt-2 break-all text-sm text-slate-700">{product.uid}</p>
                </div>
              </CardContent>
            </SurfaceCard>
          </div>
        </div>

        <div className="mt-24">
          <h3 className="mb-6 text-3xl font-bold text-slate-900">Goes Well Together</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(relatedProducts.length > 0 ? relatedProducts : products.slice(0, 4)).map((item) => (
              <div key={item.id} className="relative">
                <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow">
                  <Heart className="h-5 w-5 text-slate-500" />
                </div>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
    </AppShell>
  );
}
