import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasDashboardAccess } from '@/lib/auth.util';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireDashboardAccess?: boolean;
}

/**
 * Protected Route Component
 * Redirects users based on authentication and role requirements
 * 
 * @param requireDashboardAccess - If true, only owner/staff can access
 */
export function ProtectedRoute({ children, requireDashboardAccess = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Not logged in - redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check dashboard access if required
  if (requireDashboardAccess && !hasDashboardAccess(user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
