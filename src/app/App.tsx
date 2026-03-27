import { RouterProvider } from 'react-router';
import { router } from './routes';
import ErrorBoundary from '../components/ErrorBoundary';
import { CartProvider } from '../contexts/CartContext';
import { CommunityGalleryProvider } from '../contexts/CommunityGalleryContext';
import { DesignTabsProvider } from '../contexts/DesignTabsContext';
import { AppDataProvider } from '../contexts/AppDataContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppDataProvider>
          <CartProvider>
            <DesignTabsProvider>
              <CommunityGalleryProvider>
                <RouterProvider router={router} />
              </CommunityGalleryProvider>
            </DesignTabsProvider>
          </CartProvider>
        </AppDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
