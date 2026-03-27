import { useEffect } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import DesigningArea from '../pages/DesigningArea';
import ErrorBoundary from '../components/ErrorBoundary';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AppDataProvider } from '../contexts/AppDataContext';
import { CartProvider } from '../contexts/CartContext';
import { CommunityGalleryProvider } from '../contexts/CommunityGalleryContext';
import { DesignTabsProvider } from '../contexts/DesignTabsContext';

function DesignWorkspace() {
  const { storefrontUser } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('productId') || undefined;
  const tabId = searchParams.get('tabId') || undefined;

  useEffect(() => {
    if (!storefrontUser) {
      window.location.replace('/login');
    }
  }, [storefrontUser]);

  if (!storefrontUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-semibold">Redirecting to login</h1>
          <p className="mt-3 text-sm text-slate-300">
            Please sign in to continue into the separate design workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MemoryRouter>
      <Routes>
        <Route
          path="*"
          element={<DesigningArea productIdOverride={productId} tabIdOverride={tabId} documentNavigation />}
        />
      </Routes>
    </MemoryRouter>
  );
}

export default function DesignApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppDataProvider>
          <CartProvider>
            <DesignTabsProvider>
              <CommunityGalleryProvider>
                <DesignWorkspace />
              </CommunityGalleryProvider>
            </DesignTabsProvider>
          </CartProvider>
        </AppDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
