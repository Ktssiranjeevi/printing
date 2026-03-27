import { Button } from './ui/button';
import { storefrontCategories } from '../data/categories';
import '../styles/product-sidebar.css';

interface ProductSidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  categories?: string[];
}

export default function ProductSidebar({
  selectedCategory = 'All products',
  onCategorySelect = () => {},
  categories = storefrontCategories,
}: ProductSidebarProps) {
  return (
    <aside className="product-sidebar">
      <div className="product-sidebar__list">
        <h3 className="product-sidebar__title">Categories</h3>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'ghost'}
            className={`product-sidebar__button ${
              selectedCategory === category
                ? 'product-sidebar__button--active'
                : ''
            }`}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </aside>
  );
}
