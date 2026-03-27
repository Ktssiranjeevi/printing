import ProductCard from './ProductCard';
import { Product } from '../data/products';
import '../styles/product-grid.css';

interface ProductGridProps {
  products: Product[];
  selectedCategory?: string;
}

export default function ProductGrid({ products, selectedCategory }: ProductGridProps) {
  const filteredProducts =
    selectedCategory && selectedCategory !== 'All products'
      ? products.filter((product) => product.category === selectedCategory)
      : products;

  return (
    <div className="product-grid">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
