import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireStorefrontAuth() {
  const location = useLocation();
  const { storefrontUser } = useAuth();

  if (!storefrontUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
