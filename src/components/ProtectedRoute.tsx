import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { Permission } from '../config/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check adminOnly (backwards compatibility)
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  // Check multiple permissions
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? requiredPermissions.every(p => hasPermission(p))
      : requiredPermissions.some(p => hasPermission(p));
    
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
