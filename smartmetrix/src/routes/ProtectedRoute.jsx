import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * ProtectedRoute — guards a route based on authentication and role.
 * If no user is logged in, redirects to /login.
 * If a roleKey is required and doesn't match, redirects to the correct dashboard.
 */
export default function ProtectedRoute({ children, roleKey }) {
  const currentUser = authService.getCurrentUser();

  // Not logged in at all — go to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role — redirect to the correct dashboard
  if (roleKey && currentUser.roleKey !== roleKey) {
    const redirectPath =
      currentUser.roleKey === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
