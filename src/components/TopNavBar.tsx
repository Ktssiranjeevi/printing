import { Link } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, User, ShoppingCart, Package, Shield } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import '../styles/top-nav.css';

interface TopNavBarProps {
  showBackButton?: boolean;
}

export default function TopNavBar({ showBackButton = false }: TopNavBarProps) {
  const { itemCount } = useCart();

  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <div className="top-nav__row">
          <div className="top-nav__brand-group">
            {showBackButton && (
              <Button
                variant="outline"
                size="sm"
                className="top-nav__back-button"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            )}
            <Link to="/" className="top-nav__brand">
              <div className="top-nav__logo">
                <span className="top-nav__logo-text">PC</span>
              </div>
              <span className="top-nav__brand-text">Product Customizer</span>
            </Link>
          </div>

          <div className="top-nav__search-container">
            <div className="top-nav__search-wrap">
              <Search className="top-nav__search-icon" />
              <Input
                type="text"
                placeholder="Search products..."
                className="top-nav__search"
              />
            </div>
          </div>

          <div className="top-nav__actions">
            <Button
              variant="ghost"
              size="sm"
              className="top-nav__action"
              asChild
            >
              <a href="/admin.html">
                <Shield className="h-4 w-4" />
                <span className="top-nav__action-label">Admin</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="top-nav__action"
              asChild
            >
              <Link to="/profile">
                <User className="h-4 w-4" />
                <span className="top-nav__action-label">Profile</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="top-nav__action"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                <span className="top-nav__action-label">Cart{itemCount > 0 ? ` (${itemCount})` : ''}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="top-nav__action"
              asChild
            >
              <Link to="/order">
                <Package className="h-4 w-4" />
                <span className="top-nav__action-label">Order</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
