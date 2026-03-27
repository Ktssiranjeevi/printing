import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Baby,
  BookOpen,
  Briefcase,
  CalendarDays,
  ImageIcon,
  Shirt,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import ProductCard from '../components/ProductCard';
import { useAppData } from '../contexts/AppDataContext';

const featuredCategoryIcons = [
  { label: 'Bestsellers', Icon: Shirt, accent: 'from-orange-200 via-orange-100 to-white' },
  { label: 'New Arrivals', Icon: ShoppingBag, accent: 'from-sky-200 via-cyan-100 to-white' },
  { label: 'Kids & baby clothing', Icon: Baby, accent: 'from-pink-200 via-rose-100 to-white' },
  { label: 'Photo books', Icon: BookOpen, accent: 'from-violet-200 via-purple-100 to-white' },
  { label: 'Calendars', Icon: CalendarDays, accent: 'from-amber-200 via-yellow-100 to-white' },
  { label: 'Wall art', Icon: ImageIcon, accent: 'from-emerald-200 via-teal-100 to-white' },
  { label: 'Phone cases', Icon: Smartphone, accent: 'from-indigo-200 via-blue-100 to-white' },
  { label: 'Stationery & Business', Icon: Briefcase, accent: 'from-slate-300 via-slate-100 to-white' },
] as const;

const promoSlides = [
  {
    eyebrow: 'Summer sale',
    title: 'Up to 40% off custom essentials',
    description: 'Fresh drops, quick reorders, and easy personalization for your best-selling products.',
    cta: 'Open catalog',
    accent: 'from-[#102542] via-[#0f4c81] to-[#57c4e5]',
  },
  {
    eyebrow: 'New collection',
    title: 'Launch standout apparel this week',
    description: 'Discover trending blanks, premium fits, and ready-to-brand styles for your next catalog update.',
    cta: 'Browse products',
    accent: 'from-[#3b1f2b] via-[#8f3b76] to-[#f38ba0]',
  },
  {
    eyebrow: 'Brand bundles',
    title: 'Save more when you build a full set',
    description: 'Combine tees, mugs, cases, and stationery into one high-conversion bundle for shoppers.',
    cta: 'View offers',
    accent: 'from-[#183a37] via-[#2b7a78] to-[#def2f1]',
  },
] as const;

function formatCurrency(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Home() {
  const navigate = useNavigate();
  const { products } = useAppData();
  const [activeSlide, setActiveSlide] = useState(0);

  const activeProducts = useMemo(
    () => products.filter((product) => product.status === 'Active'),
    [products],
  );

  const recentVisitedProducts = activeProducts.slice(0, 4);
  const newlyComeProducts = [...activeProducts].slice(-4).reverse();
  const popularProducts = [...activeProducts]
    .sort((left, right) => (right.offerPrice ?? right.price) - (left.offerPrice ?? left.price))
    .slice(0, 4);

  const brands = useMemo(() => {
    const brandMap = new Map<string, number>();

    activeProducts.forEach((product) => {
      brandMap.set(product.brand, (brandMap.get(product.brand) ?? 0) + 1);
    });

    return Array.from(brandMap.entries()).map(([name, count]) => ({
      name,
      count,
      tagline: `${count} product${count === 1 ? '' : 's'} available`,
    }));
  }, [activeProducts]);

  useEffect(() => {
    if (promoSlides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % promoSlides.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openCatalog = () => navigate('/catalog');

  const renderProductSection = (title: string, description: string, items: typeof activeProducts) => (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          onClick={openCatalog}
        >
          View catalog
        </button>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={`${title}-${product.id}`} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">
          Products will appear here once active catalog items are available.
        </div>
      )}
    </section>
  );

  return (
    <AppShell activeTab="Home">
      <div className="space-y-12 pb-10">
        <section className="rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-[#fef3e2] p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:p-8">
          <div className="flex flex-col gap-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Home</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Discover products, offers, and top brands in one storefront.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Start with your major categories, check the latest offers, then move into the full product catalog and product details.
              </p>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="grid min-w-[920px] grid-cols-8 gap-4">
                {featuredCategoryIcons.map(({ label, Icon, accent }) => (
                  <button
                    key={label}
                    type="button"
                    className="group flex flex-col items-center gap-3 rounded-[28px] bg-white/80 p-3 text-center transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)]"
                    onClick={openCatalog}
                  >
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${accent} shadow-inner`}>
                      <Icon className="h-9 w-9 text-slate-800 transition duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-sm font-medium leading-5 text-slate-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-center">
          <div className="w-full max-w-[1000px] overflow-hidden rounded-[36px] bg-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
            <div
              className="flex h-[400px] transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {promoSlides.map((slide) => (
                <article
                  key={slide.title}
                  className={`flex h-[400px] min-w-full flex-col justify-between bg-gradient-to-br ${slide.accent} p-8 text-white md:p-12`}
                >
                  <div className="max-w-xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">{slide.eyebrow}</p>
                    <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{slide.title}</h2>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 md:text-base">{slide.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      onClick={openCatalog}
                    >
                      {slide.cta}
                    </button>
                    <div className="hidden rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white/80 md:block">
                      Offers curated for your catalog front page
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 bg-slate-950/90 px-6 py-4">
              {promoSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index ? 'w-10 bg-white' : 'w-2.5 bg-white/35'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {renderProductSection('Recent visited', 'Easy access to products your shoppers are likely to reopen.', recentVisitedProducts)}
        {renderProductSection('Newly come', 'Fresh additions ready to highlight on the storefront.', newlyComeProducts)}
        {renderProductSection('Popular', 'High-value products with strong offer pricing and appeal.', popularProducts)}

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Brands</h2>
              <p className="mt-1 text-sm text-slate-600">Trusted product lines ready for custom orders and repeat buying.</p>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              onClick={openCatalog}
            >
              Open catalog
            </button>
          </div>
          {brands.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {brands.map((brand, index) => (
                <article
                  key={brand.name}
                  className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{brand.name}</h3>
                      <p className="text-sm text-slate-500">Brand #{index + 1}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-600">{brand.tagline}</p>
                  <div className="mt-6 flex items-center justify-between text-sm">
                    <span className="font-medium text-emerald-700">Starting {formatCurrency(999 + index * 120)}</span>
                    <span className="text-slate-500">{brand.count} items</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">
              Brand cards will appear once products are available.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
