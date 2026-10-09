import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

export interface AdminRouteGuardProps {
  children?: React.ReactNode;
}

/**
 * Route protection architecture for Admin Panel.
 * Reserved for Phase implementation with Firebase RBAC.
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  // Check mock/session admin authorization token
  const isAdminAuthenticated =
    typeof window !== 'undefined' &&
    (localStorage.getItem('ns_admin_access') === 'true' ||
      sessionStorage.getItem('ns_admin_access') === 'true' ||
      import.meta.env.DEV); // Allow access in local development for testing placeholder

  if (!isAdminAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
