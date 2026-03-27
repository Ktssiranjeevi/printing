import { type ChangeEvent, type DragEvent, type FormEvent, useMemo, useState } from 'react';
import { ImagePlus, Pencil, Search, Trash2, Upload, X } from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAppData } from '../contexts/AppDataContext';
import { productCategories } from '../data/categories';
import type { Product } from '../data/products';

interface ProductManagementPageProps {
  initialSearchQuery?: string;
  initialCategoryFilter?: string;
  initialStatusFilter?: 'all' | Product['status'];
}

interface ProductFormState {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  offerPrice: string;
  stock: string;
  status: Product['status'];
  image: string;
  description: string;
  fabrication: string;
  colors: string;
  sizes: string;
  technology: string;
  printTechniques: string;
}

const emptyProductForm: ProductFormState = {
  id: '',
  name: '',
  brand: '',
  category: '',
  price: '',
  offerPrice: '',
  stock: '0',
  status: 'Active',
  image: '',
  description: '',
  fabrication: '',
  colors: '',
  sizes: '',
  technology: '',
  printTechniques: '',
};

const sizeOptions = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const technologyOptions = ['DTG', 'DTF', 'Embroidery', 'Screen print', 'Heat transfer'];
const printTechniqueOptions = [
  'Front print',
  'Back print',
  'Chest print',
  'Oversized print',
  'Sleeve print',
  'Pocket print',
  'Left chest',
  'Full front',
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function toCsv(values: string[]) {
  return values.join(', ');
}

export default function ProductManagementPage({
  initialSearchQuery = '',
  initialCategoryFilter = 'all',
  initialStatusFilter = 'all',
}: ProductManagementPageProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useAppData();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProductFormState>(emptyProductForm);
  const [isDragActive, setIsDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [statusFilter, setStatusFilter] = useState<'all' | Product['status']>(initialStatusFilter);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
    setCategoryFilter(initialCategoryFilter);
    setStatusFilter(initialStatusFilter);
  }, [initialCategoryFilter, initialSearchQuery, initialStatusFilter]);

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const selectedSizes = formState.sizes.split(',').map((value) => value.trim()).filter(Boolean);
  const selectedTechnology = formState.technology.split(',').map((value) => value.trim()).filter(Boolean);
  const selectedPrintTechniques = formState.printTechniques.split(',').map((value) => value.trim()).filter(Boolean);
  const selectedColors = formState.colors.split(',').map((value) => value.trim()).filter(Boolean);

  const toggleMultiValue = (
    currentValues: string[],
    field: 'sizes' | 'technology' | 'printTechniques',
    value: string,
  ) => {
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    handleChange(field, toCsv(nextValues));
  };

  const removeColor = (colorToRemove: string) => {
    handleChange(
      'colors',
      toCsv(selectedColors.filter((color) => color !== colorToRemove)),
    );
  };

  const readImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      handleChange('image', result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      readImageFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      readImageFile(file);
    }
  };

  const handleEditProduct = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setSelectedProductId(productId);
    setFormState({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      offerPrice: product.offerPrice ? String(product.offerPrice) : '',
      stock: String(product.stock),
      status: product.status,
      image: product.image,
      description: product.description,
      fabrication: product.fabrication,
      colors: toCsv(product.colors),
      sizes: toCsv(product.sizes),
      technology: toCsv(product.technology),
      printTechniques: toCsv(product.printTechniques),
    });
  };

  const resetForm = () => {
    setSelectedProductId(null);
    setFormState(emptyProductForm);
    setIsDragActive(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: formState.id.trim() || undefined,
      name: formState.name.trim(),
      brand: formState.brand.trim(),
      category: formState.category.trim(),
      price: Number(formState.price),
      offerPrice: formState.offerPrice ? Number(formState.offerPrice) : undefined,
      stock: Number(formState.stock),
      status: formState.status,
      image: formState.image.trim() || 'https://via.placeholder.com/300x300/0f172a/e2e8f0?text=Product',
      description: formState.description.trim(),
      fabrication: formState.fabrication.trim(),
      colors: selectedColors,
      sizes: selectedSizes,
      technology: selectedTechnology,
      printTechniques: selectedPrintTechniques,
    };

    if (selectedProductId) {
      updateProduct(selectedProductId, payload);
    } else {
      addProduct(payload);
    }

    resetForm();
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchableText = [product.name, product.brand, product.category, product.uid].join(' ').toLowerCase();
      const matchesSearch = searchQuery.trim() === '' || searchableText.includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, products, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Product management database</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Add new products, edit existing listings, remove outdated entries, and review your inventory with search and filter controls.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(360px,430px)_minmax(0,1fr)]">
        <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">{selectedProductId ? 'Edit product' : 'Add product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-id">Product ID</Label>
                  <Input id="product-id" value={formState.id} onChange={(event) => handleChange('id', event.target.value)} placeholder="Optional custom id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input id="product-stock" type="number" min="0" value={formState.stock} onChange={(event) => handleChange('stock', event.target.value)} required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price</Label>
                  <Input id="product-price" type="number" min="0" step="0.01" value={formState.price} onChange={(event) => handleChange('price', event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-offer-price">Offer Price</Label>
                  <Input id="product-offer-price" type="number" min="0" step="0.01" value={formState.offerPrice} onChange={(event) => handleChange('offerPrice', event.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" value={formState.name} onChange={(event) => handleChange('name', event.target.value)} required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-brand">Brand</Label>
                  <Input id="product-brand" value={formState.brand} onChange={(event) => handleChange('brand', event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <select
                    id="product-category"
                    value={formState.category}
                    onChange={(event) => handleChange('category', event.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {productCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-status">Status</Label>
                <select
                  id="product-status"
                  value={formState.status}
                  onChange={(event) => handleChange('status', event.target.value as Product['status'])}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-image">Product Image</Label>
                <label
                  htmlFor="product-image"
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-8 text-center transition ${
                    isDragActive
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-slate-300 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/70'
                  }`}
                >
                  <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                    {formState.image ? <ImagePlus className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Drag and drop a product image</p>
                    <p className="mt-1 text-xs text-slate-500">Or click to upload from your device</p>
                  </div>
                  <input id="product-image" type="file" accept="image/*" className="hidden" onChange={handleImageInputChange} />
                </label>

                {formState.image && (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">Uploaded preview</p>
                      <Button type="button" variant="ghost" className="text-slate-600 hover:bg-white hover:text-slate-900" onClick={() => handleChange('image', '')}>
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                    <img src={formState.image} alt="Product preview" className="h-52 w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea id="product-description" value={formState.description} onChange={(event) => handleChange('description', event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-fabrication">Fabrication</Label>
                <Textarea id="product-fabrication" value={formState.fabrication} onChange={(event) => handleChange('fabrication', event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-colors">Colors</Label>
                <Input id="product-colors" value={formState.colors} onChange={(event) => handleChange('colors', event.target.value)} placeholder="#ffffff, #111827, #0ea5e9" />
                {selectedColors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((color) => (
                      <button key={color} type="button" onClick={() => removeColor(color)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: color }} />
                        {color}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Sizes</Label>
                <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  {sizeOptions.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <Button
                        key={size}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => toggleMultiValue(selectedSizes, 'sizes', size)}
                        className={isSelected ? 'rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300' : 'rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-slate-900'}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Technology</Label>
                <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  {technologyOptions.map((technology) => {
                    const isSelected = selectedTechnology.includes(technology);
                    return (
                      <Button
                        key={technology}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => toggleMultiValue(selectedTechnology, 'technology', technology)}
                        className={isSelected ? 'rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300' : 'rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-slate-900'}
                      >
                        {technology}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Print Techniques</Label>
                <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  {printTechniqueOptions.map((technique) => {
                    const isSelected = selectedPrintTechniques.includes(technique);
                    return (
                      <Button
                        key={technique}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => toggleMultiValue(selectedPrintTechniques, 'printTechniques', technique)}
                        className={isSelected ? 'rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300' : 'rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-slate-900'}
                      >
                        {technique}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300">
                  {selectedProductId ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-slate-900" onClick={resetForm}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Searchable product database</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by name, brand, category, or UID" className="pl-10" />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="all">All categories</option>
                  {productCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'all' | Product['status'])}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="all">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[96px_minmax(0,1fr)_auto] lg:items-center">
                    <img src={product.image} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-slate-900">{product.name}</h4>
                        <Badge className={product.status === 'Active' ? 'border-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : product.status === 'Draft' ? 'border-0 bg-amber-100 text-amber-800 hover:bg-amber-100' : 'border-0 bg-slate-200 text-slate-700 hover:bg-slate-200'}>
                          {product.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{product.brand} | {product.category}</p>
                      <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-4">
                        <p>Price: <span className="font-medium text-slate-900">{formatCurrency(product.price)}</span></p>
                        <p>Stock: <span className="font-medium text-slate-900">{product.stock}</span></p>
                        <p>UID: <span className="font-medium text-slate-900">{product.uid}</span></p>
                        <p>Sizes: <span className="font-medium text-slate-900">{product.sizes.join(', ')}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      <Button type="button" variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:text-slate-900" onClick={() => handleEditProduct(product.id)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button type="button" variant="outline" className="rounded-2xl border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    No products matched the current search and filter combination.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
