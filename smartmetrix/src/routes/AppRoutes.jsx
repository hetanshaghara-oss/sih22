import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingState from '../components/LoadingState';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route guard
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded Pages for Production Code-Splitting & Fast Initial Load
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const RulesRegistry = lazy(() => import('../pages/RulesRegistry'));

const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const NewInspection = lazy(() => import('../pages/NewInspection'));
const InspectionPreview = lazy(() => import('../pages/InspectionPreview'));
const InspectionProcessing = lazy(() => import('../pages/InspectionProcessing'));
const InspectionResult = lazy(() => import('../pages/InspectionResult'));
const InspectionHistory = lazy(() => import('../pages/InspectionHistory'));
const InspectionDetails = lazy(() => import('../pages/InspectionDetails'));

const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminQueue = lazy(() => import('../pages/AdminQueue'));
const AdminReview = lazy(() => import('../pages/AdminReview'));
const AdminResult = lazy(() => import('../pages/AdminResult'));
const Rules = lazy(() => import('../pages/Rules'));

const Reports = lazy(() => import('../pages/Reports'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState message="Loading portal component..." />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rules-registry" element={<RulesRegistry />} />
        </Route>

        {/* User / Enforcement Officer Routes */}
        <Route element={<UserLayout />}>
          <Route path="/user/dashboard" element={<ProtectedRoute roleKey="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/new-inspection" element={<ProtectedRoute roleKey="user"><NewInspection /></ProtectedRoute>} />
          <Route path="/user/inspection-preview" element={<ProtectedRoute roleKey="user"><InspectionPreview /></ProtectedRoute>} />
          <Route path="/user/inspection-processing/:id" element={<ProtectedRoute roleKey="user"><InspectionProcessing /></ProtectedRoute>} />
          <Route path="/user/inspection-result/:id" element={<ProtectedRoute roleKey="user"><InspectionResult /></ProtectedRoute>} />
          <Route path="/user/inspection-history" element={<ProtectedRoute roleKey="user"><InspectionHistory /></ProtectedRoute>} />
          <Route path="/user/inspection-details/:id" element={<ProtectedRoute roleKey="user"><InspectionDetails /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* Admin / Verification Officer Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<ProtectedRoute roleKey="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/queue" element={<ProtectedRoute roleKey="admin"><AdminQueue /></ProtectedRoute>} />
          <Route path="/admin/review/:id" element={<ProtectedRoute roleKey="admin"><AdminReview /></ProtectedRoute>} />
          <Route path="/admin/result/:id" element={<ProtectedRoute roleKey="admin"><AdminResult /></ProtectedRoute>} />
          <Route path="/admin/rules" element={<ProtectedRoute roleKey="admin"><Rules /></ProtectedRoute>} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
