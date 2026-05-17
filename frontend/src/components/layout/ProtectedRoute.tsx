import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth.types';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-slate-950">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">Access Denied</p>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          You don't have permission to view this page.
        </p>
        <Button variant="secondary" size="sm" onClick={() => history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
