import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Product } from '../data/products';
import '../styles/product-card.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
      className="product-card"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="product-card__image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image"
          />
          <Button
            variant="ghost"
            size="sm"
            className="product-card__favorite"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`product-card__favorite-icon ${isFavorite ? 'product-card__favorite-icon--active' : ''}`}
            />
          </Button>
        </div>
        <div className="product-card__body">
          <h3 className="product-card__title line-clamp-2">
            {product.name}
          </h3>
          <p className="product-card__brand">
            {product.brand}
          </p>
          {product.offerPrice ? (
            <div className="space-y-1">
              <p className="text-sm text-slate-500 line-through">
                {formatPrice(product.price)}
              </p>
              <p className="product-card__price text-emerald-700">
                {formatPrice(product.offerPrice)} excl. VAT
              </p>
            </div>
          ) : (
            <p className="product-card__price">
              {formatPrice(product.price)} excl. VAT
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
